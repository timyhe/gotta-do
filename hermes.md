# HermesCore REST Service

A REST interface to Hermes.
## Setting up Visual Studio 2015

1. Open %APPDATA%\NuGet\NuGet.Config
2. Add to packageSources section:
```xml
<add key="wtl-artifactory" value="http://wtl-artifactory.wtldev.net/artifactory/api/nuget/nuget-dev" />
```

## Summary

Hermes is a storage wrapper service accessible primarily via REST, utilizing a semi-normalized 
table structure built on top of PostgreSQL JSONB data field. This allows for storing large objects in a
format that can be appended to, reordered, and queried in a quick and efficient manner.


# Interfaces

## IHermesItem
IHermesItem is how all items will be returned by various queries. It is a simple wrapper which 
includes the key and orderIndex fields, as well as the actual data contained in the JSONB field.

```CSharp
    public interface IHermesItem
    {
        long? orderIndex { get; set; }
        string key { get; set; }
        dynamic data { get; set; }
    }
 ```

## IHermesResponse
IHermesResponse is the basic response wrapper object. All REST calls will response with an IHermesResponse
compatible object. 

```CSharp
    public interface IHermesResponse
    {
        // this is your actual requested object
        object body { get; set; }
        // true if everything went fine, false otherwise
        bool success { get; set; }
        // the PostgreSQL exception error code (https://www.postgresql.org/docs/9.5/static/errcodes-appendix.html)
        string pexCode { get; set; }
        // description of the error
        string message { get; set; }
        // a floating point number, in ms, of how long the request took the server to satisfy
        double? duration { get; }
        // a long integer that (in some requests) contains the length of the query/table
        long? results { get; set; }
    }
```

# Routes

## /api
### GET (get databases)
Returns a string[] containing the names of all available databases.

## /api/{dbName}
### POST (create database)
Creates a new database with name of dbName. No post body required.

### GET (get tables)
Returns a string[] containing the names of all tables in dbName.

## /api/{dbName}/tables/{tableName}
### POST (create table)
Creates a table with the name of tableName in dbName. The useOrderIndex boolean can be set to false to create a Hermes table that does not attempt to track order of the entries. This can be much faster when adding/deleting items. Default is useOrderIndex=true.

    Request Body: {
        useOrderIndex: boolean
    }

### GET (get table keys)
Returns a string[] with all keys in tableName

### DELETE (delete table)
Drops the table tableName


## /api/{dbName}/tables/{tableName}/count
### GET (get table size)
Returns the length of the table, with the value stored in the IHermesResponse.results field. body will be null.

## /api/{dbName}/tables/{tableName}/items
### GET (get table items)
Returns a IHermesItem[] containing all the items in the table

### POST (insert item)
Inserts the provided IHermesItem into tableName, using the key and orderIndex within the post body

    Request Body: IHermesItem

### PUT (upsert item)
Performs an upsert using the provided IHermesItem on tableName

    Request Body: IHermesItem

## /api/{dbName}/tables/{tableName}/items/{key}
### GET (get item)
Returns the IHermesItem that matches key.

### DELETE (delete item)
Deletes the item at key

### PUT (update item)
Updates the data of the item at key (does not update orderIndex yet)

    Request Body: IHermesItem

## /api/{dbName}/tables/{tableName}/bulk-get
### POST (bulk get)
Returns an array of IHermesItem objects that match the keys provided in the request.

    Request Body: {
        keys: string[]
    }

## /api/{dbName}/tables/{tableName}/bulk-delete
### POST (bulk delete)
Performs a bulk delete of the keys supplied in the request.

Request Body: {
        keys: string[]
    }

## /api/{dbName}/tables/{tableName}/bulk-insert
### POST (bulk insert)
Performs a bulk insert of IHermesItems. Cannot be used to insert in between items. Can only be used on tables without an OrderIndex

    Request Body: { 
        items: IHermesItem[] 
    }

## /api/{dbName}/tables/{tableName}/bulk-upsert
### POST (bulk upsert)
Performs a bulk upsert of IHermesItems. Cannot be used to insert in between items or update orderIndex.

    Request Body: { 
        items: IHermesItem[] 
    }

## /api/{dbName}/thumbnails
### GET (thumbnails keys)
Returns a string[] with all keys in thumbnails table.

## /api/{dbName}/thumbnails/{*key}
### GET (thumbnails image)
Returns the image that matches the key.

## /api/{dbName}/thumbnails/{*key}
### POST (insert image)
Inserts the provided image into thumbnails table, using the key, image name, and the image itself within the post body.

## /api/{dbName}/thumbnails/{*key}
### PUT (upsert image)
Performs an upsert using the provided image on thumbnails.

## /api/{dbName}/text
### GET (text keys)
Returns a string[] with all keys in text table.

## /api/{dbName}/text/{*key}
### GET (text string)
Returns the string of text that matches the key.

## /api/{dbName}/text/{*key}
### POST (insert text)
Inserts the provided text into thumbnails table, using the key, mimeType, and the text itself within the post body

	Request Body: { 
		text: string 
	}

## /api/{dbName}/text/{*key}
### PUT (upsert text)
Performs an upsert using the provided text and mimeType on text.

	Request Body: { 
		text: string 
	}

## /api/{dbName}/tables/{tableName}/query/dynamic
### POST (dynamic query)
Performs a dynamic query against tableName.

whereInject: This is a string encapsulating your SQL where query condition (without the WHERE part) 
Example: "key=123" 

orderbyInject: Optional, this is a string encapsulating the order by clause entirely. If ommited, "ORDER BY id" is assumed
Example: "ORDER BY key"

pageSize: Optional, sets the size of page to get in dynamic query. If ommited, returns all items in query.

pageNum: Optional, sets the page number to start on, if paging. If pageSize is specified, but pageNum ommited, pageNum 0 is assumed.

    Request Body: { 
        whereInject: string;
        orderbyInject: string;
        pageSize: number;
        pageNum: number;
    }

## /api/{dbName}/tables/{tableName}/query/page
### POST (paging query)
Performs a reverse paging query. Will get pageSize items, from bottom of table (by orderIndex), starting at startKey. 

pageSize: Sets the size of page to get in query.

startKey: Optional, starts the paging at startKey. If ommited, starts at bottom of table.

    Request Body: { 
        startKey?: string;
        pageSize: number;
    }

## /api/{dbName}/function/{name}
### POST (call stored procedure/function)
Calls the name stored procedure/function in dbName.

    Request Body: { 
        queryType: string of “query”, “scalar”, or “nonquery”. Defaults to “nonquery” if not provided or not previous two.
        queryParams: { [parameterName: string]: parameterValue } this is a JavaScript hashtable
    } 

The key/values of queryParams should map to the variable names of your function. Case matters, so following Hermes convention, the keys will be converted to lower case before sent to server. Make sure your functions are defined using lower case variable names (this happens by default unless you specifically quote them). If your key names don’t match up, you will get “function myFunc (var1 -> char , var2 -> char) not found” errors, not “parameter names don’t match”.

The return type depends on the queryType parameter, as it will govern how the function is executed. “nonquery” will return nothing, “scalar” will return the first value from the first column of the result set, and “query” will return a pseudo table of sorts, of the form:
{
    columns: string[];
    rows: any[];
}

If there are any json/jsonb fields returned in the query, they should be parsed such that they are returned to the client as proper objects, so double parsing should not be required by clients. Columns/rows arrays will be in the order that the function query returned them.
I’m going to test it a bit more tomorrow, but should be merged into mainline & available in builds by Friday.        
