/***********************************************************************
*
* DESCRIPTION :
*      Property file for constant data
*  
* Copyright :
*		Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*		Puneet (puneet@aranoah.com)      
*
* START DATE :    
*		11 Nov 2014
*
* CHANGES :
*
**/
var mongoErr = {
	"11000":{code:400,msg:"Not able to insert duplicate values to the database"} ,
 	"12515":{code:400,msg:"Not able to remove or update"} ,
 	"13074":{code:400,msg:"Database name can not be empty"} ,
 	"17399":{code:400,msg:"Collection already exists"} ,
 	"10011":{code:400,msg:"No collection name found"} ,
 	"13328":{code:500,msg:"Connection falied"} ,
 	"13071":{code:400,msg:"Invalid hostname"} ,
 	"10333":{code:400,msg:"Invalid field name"}
}
module.exports=mongoErr