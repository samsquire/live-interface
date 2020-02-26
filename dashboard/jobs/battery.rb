
# :first_in sets how long it takes before the job is first run. In this case, it is run immediately
SCHEDULER.every '10s', :first_in => 0 do |job|
  battery_level = `pmset -g batt`
  temperature = `/Applications/TemperatureMonitor.app/Contents/MacOS/tempmonitor -c -l -a`

  temperature.each_line do |line|
    temperatures = /(?<component>[[:ascii:]]+?): (?<temperature>\d+?\sC)/.match(line)
    if temperatures then
      component = temperatures["component"]
      temperature = temperatures["temperature"]
      send_event(component + '_temperature', { current: temperature })
    end
  end

  data = /Currently drawing from '(?<source>[[:ascii:]]+?)'\n\s-InternalBattery-0\s(?<level>\d+?)%;\s(?<state>charging|discharging);\s(?<remaining>[[:ascii:]]+?)\sremaining\n/.match(battery_level)

  if data then
    source = data["source"]
    level = data["level"]
    remaining = data["remaining"]

    state = data["state"]
    state_description = data["state"] == "charging" ? "Time until charged" : "Remaining battery"

    puts source, level, remaining, state
    send_event('source', { text: source })
    send_event('charge_time', { text: remaining, title: state_description })
    send_event('battery', { current: level, moreinfo: state })
  end

  cpu = `top -o cpu -l 2 -n 10 -stats cpu,command | tail -n 10`
  usages = []
  cpu.each_line do |line|
    progs = /(?<utilization>[[:ascii:]]+?)\s+?\b(?<program>[[:ascii:]]+?)\s+?$/.match(line)
    if progs then
     usages.push({"label" => progs["program"], "value" => progs["utilization"]})
    end
  end
  puts usages
  send_event('cpu', {items: usages})
 
end
