"use strict";

let connection_string = `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
	connection_string = `${process.env.OPENSHIFT_MONGODB_DB_USERNAME}:${process.env.OPENSHIFT_MONGODB_DB_PASSWORD}@${process.env.OPENSHIFT_MONGODB_DB_HOST}:${process.env.OPENSHIFT_MONGODB_DB_PORT}/${process.env.OPENSHIFT_APP_NAME}`;
}

module.exports = {
	secret: 'HSGRFejkluEugv&*^8743bkjsdckjDkjbk',
	url: connection_string
};