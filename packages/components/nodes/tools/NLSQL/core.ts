
/*
import { Tool } from "@langchain/core/tools"
import { config } from "dotenv";
import fetch from 'node-fetch'
const { Pool } = require('pg');

export const desc = `Use this when you want to POST to a website.
Input should be a json string with two keys: "url" and "data".
The value of "url" should be a string, and the value of "data" should be a dictionary of 
key-value pairs you want to POST to the url as a JSON body.
Be careful to always use double quotes for strings in the json string
The output will be the text response of the POST request.`

export interface Headers {
    [key: string]: string
}

export interface Body {
    [key: string]: any
}

export interface RequestParameters {
    headers?: Headers
    body?: Body
    url?: string
    description?: string
    maxOutputLength?: number
}

export class NLSQL extends Tool {
    name = 'NLSQL'
    url = ''
    description = desc
    maxOutputLength = Infinity
    headers = {}
    body = {}


constructor(args?: RequestParameters) {
    super()
    this.url = args?.url ?? this.url
    this.headers = args?.headers ?? this.headers
    this.body = args?.body ?? this.body
    this.description = args?.description ?? this.description
    this.maxOutputLength = args?.maxOutputLength ?? this.maxOutputLength
}


         config = {
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            port: parseInt(process.env.DB_PORT || "5432"),
            ssl: process.env.DB_SSL === "true",
          };
          

 pool = new Pool(config);




        async _call(input: string) {
            try {
                let inputUrl = ''
                let inputBody = {}
                if (Object.keys(this.body).length || this.url) {
                    if (this.url) inputUrl = this.url
                    if (Object.keys(this.body).length) inputBody = this.body
                } else {
                    const { url, data } = JSON.parse(input)
                    inputUrl = url
                    inputBody = data
                }
        
                if (process.env.DEBUG === 'true') console.info(`Making POST API call to ${inputUrl} with body ${JSON.stringify(inputBody)}`)
        
                const response = await fetch(inputUrl, {
                    method: 'POST',
                    headers: this.headers,
                    body: JSON.stringify(inputBody)
                })
        
                const data = await response.json();

                const sqlQuery = data.sql;

                const res = await this.pool.query(sqlQuery)

                const rows = res.rows;

                rows.forEach((row: any) => {
                    console.log(`Read: ${JSON.stringify(row)}`)
                });
                return rows;

                

                

                await this.pool.connect()

                const dbResult = await this.pool.query(sqlQuery)

                await this.pool.end() 

            // Return the database query results
            //return sqlQuery.slice(0, this.maxOutputLength)
            

            } catch (error) {
                return `${error}`
            }
        }
        }

        

*/
       
import { Tool } from "@langchain/core/tools";
import { query } from "express";
        import fetch from "node-fetch";
        import { Pool } from "pg";
        import { Client, ClientConfig } from 'pg';


        export const desc = `Use this when you want to POST to a website.
Input should be a json string with two keys: "url" and "data".
The value of "url" should be a string, and the value of "data" should be a dictionary of 
key-value pairs you want to POST to the url as a JSON body.
Be careful to always use double quotes for strings in the json string
The output will be the text response of the POST request.`
        
        export interface Headers {
          [key: string]: string;
        }
        
        export interface Body {
          [key: string]: any;
        }
        
        export interface RequestParameters {
          headers?: Headers;
          body?: Body;
          url?: string;
          description?: string;
          maxOutputLength?: number;
        }
        
        export class NLSQL extends Tool {
          name = "NLSQL";
          url = "";
          description = "Use this when you want to POST to a website.";
          maxOutputLength = Infinity;
          headers: Headers = {};
          body: Body = {};
        
          constructor(args?: RequestParameters) {
            super();
            this.url = args?.url ?? this.url;
            this.headers = args?.headers ?? this.headers;
            this.body = args?.body ?? this.body;
            this.description = args?.description ?? this.description;
            this.maxOutputLength = args?.maxOutputLength ?? this.maxOutputLength;
          }
        
          
         config = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: parseInt(process.env.DB_PORT || "5432"),
            ssl: process.env.DB_SSL === "true",
          };
          

        
          pool = new Pool(this.config);

        
          async _call(input: string) {
            try {
              let inputUrl = "";
              let inputBody = {};
              if (Object.keys(this.body).length || this.url) {
                if (this.url) inputUrl = this.url;
                if (Object.keys(this.body).length) inputBody = this.body;
              } else {
                const { url, data } = JSON.parse(input);
                inputUrl = url;
                inputBody = data;
              }
        
              if (process.env.DEBUG === "true")
                console.info(`Making POST API call to ${inputUrl} with body ${JSON.stringify(inputBody)}`);
              
              const res = await fetch(inputUrl, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify(inputBody),
              });
              
              const result = await res.json();
              const sqlQuery = result.sql;
              const dbResponse = await this.executeQuery(sqlQuery);



        
              return dbResponse;
            } catch (error) {
              return `${error}`;
            }
          }
        
          
          async executeQuery(query: string) {
            try {
              const client = await this.pool.connect();
              const result = await client.query(query);
              client.release();
              return result.rows;
            } catch (err) {
              console.error(err);
              return `Error: ${err.message}`;
            }
          }
        }
        

          

