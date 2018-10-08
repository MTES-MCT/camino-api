Hello
In a postgres DB, I have a three tables like this: parents -> children -> grandChildren.
To return all the parents, I do a query like this:

```
const parents = Parents.query().eager(‘[children.[grandchildren]]’)
```

Then I want to filter the parents who have grandChrildren with a certain name.

```
grandChildrenNames is an array of names like ['tom’, 'lucie'].
if(grandChildrenNames) {
parents.where(builder => {
builder
.whereIn(‘children:grandChildren.name’, grandChildrenNames)
})
.joinRelation('children.grandChildren')
}
```

This almost works, but if a parent has two grandChildren named Tom, it will be listed two times in the returned query.
What is the correct syntax to return a parent only once, even if he has many grandChrildren with the same name?

devin ivy
@francoisromain are you concerned with the query results (i.e. the rows returned), or with the objects returned by objection?

François Romain
the query results

devin ivy
also, which eager algorithm are you using? the default one or Join?
oh i see joinRelation in there
well, the nature of a join is that they are multiplicative
so if there's a one-to-many relationship, you are potentially going to receive multiple rows.

François Romain
ok, good to know
so is there a way to aggregate after the query ?

devin ivy
objection has tools to help manage that, and reorganize duplicate info in the result set into model objects.
objection will help perform the aggregation for you in memory, after the query results come back.
well, that's what eager() loading does
when you use eager() you can tell objection to obtain the results using one of several different "eager algorithms"
the default makes separate queries per relation, and is called the WhereInAlgorithm
one drawback of this algorithm is that you can't filter parents based upon their children/grandchildren's values, as you're trying to do.
you did a little workaround by doing a join manually!

you might be able to keep working with your workaround, and try to get distinct parent records rather than duplicates.

but another way to go would be to utilize the JoinEagerAlgorithm, and filter the results based upon the grandchildren.
do you want all grandchildren to appear in the result set even though you're only looking for parents that have grandchildren with certain names?
i.e. are you trying to filter parents and grandchildren, or just the parents?

François Romain
yes I want to

- have all grandchildren to appear
- filter only the parents

> you might be able to keep working with your workaround, and try to get distinct parent records rather than duplicates.
> How could I do that?

devin ivy
ah, okay! so i think the direction you're going is pretty interesting.
it takes a little understanding of the WhereIn algorithm.
the first query objection will make is to determine only the parents.
then a separate query will be made for children,
and a final query will be made for grandChildren.

you're concerned with adjusting the result set of the first query for parents.
check out the whereExists() / relatedQuery() example here http://vincit.github.io/objection.js/#relatedquery

François Romain
so how does relatedQuery compares to a sub query with .where(builder => { builder. ?

François Romain
I am going to digg into this first. and I’ll probably come back with more questions. Thank you @devinivy

devin ivy
no problem! i think the key is that using a subquery will make this simpler :)
what you had before was not actually a subquery
you can always chain debug() onto your queries to see what SQL is produced.
good luck! :)

François Romain

> what you had before was not actually a subquery
> this is not clear for me

devin ivy
if you obtain the sql query using debug() i should be able to show you. this modifies the same builder your are already working with,

```
parents.where(builder => {
builder
.whereIn(‘children:grandChildren.name’, grandChildrenNames)
})
```

---

(condition) || ( condition && condition ) using .where().orWhere().andWhere

Person.query().where(condition).orWhere(builder => {
builder.where(condition).where(condition)
})
