select
  "titres_activites".*,
  true as "modification"
from
  "titres_activites"
  left join "titres" as "titre" on "titre"."id" = "titres_activites"."titre_id"
where
  (
    "titre"."nom" ~* '(?=.*?(crique))'
    or "titre"."id" ~* '(?=.*?(crique))'
  )
group by
  "titres_activites"."id"