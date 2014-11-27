/*
*	IRXUser unique constraint
**/
db.irxusers.ensureIndex({"userId":1},{"unique":true})