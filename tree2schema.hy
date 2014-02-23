(import [sqlalchemy [Table Column Integer String MetaData Text]])
(def user_definition {"name" "products" "children" [{"name" "rating"} {"name" "review" "children" [{"name" "review body text"}]}]})

(defn lflatten [coll]
  "Return a single flat list expanding all members of coll"
  (if (and (instance? list coll) (not (string? coll)))
    (_flatten coll [])
    (raise (TypeError (.format "{0!r} is not a collection" coll)))))
(defn _flatten [coll result]
  (if (and (instance? list coll) (not (string? coll)))
    (do (for* [b coll]
          (_flatten b result)))
    (.append result coll))
  result)

(defn multitable [table fields] (quasiquote (Table ~table (MetaData) (unquote-splice fields))))

(defn maketable [table fields] (apply Table (+ [table (MetaData)] fields)))


(defn walk [tree] (if (tree.has-key "children")
  (let [[columns (map walk (get tree "children"))] ]
   columns)
   (Column (get tree "name") Text)))

(let [[columns (lflatten (walk user_definition))]]
  (print (maketable "products" columns))
)
