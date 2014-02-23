(import [sqlalchemy [Table Column Integer String MetaData Text]])

(def meta (MetaData))

(def product (Table "product" meta
  (kwapply (Column "id" Integer) {"primary_key" True})
  (Column "rating" Text)))

(defn upgrade [migrate_engine]
 (setv meta.bind migrate_engine)
 (product.create))

(defn downgrade [migrate_engine]
 (setv meta.bind migrate_engine)
 (product.drop))
