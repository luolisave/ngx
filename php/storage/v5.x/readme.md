<!--
@Author: Li Luo
@Date:   2016-11-07T11:10:39-05:00
@Last modified by:   Li Luo
@Last modified time: 2017-03-20T10:33:09-04:00
-->

Li's Simple Storage
==========================

This is an simple json storage API for store small amount of data.

<br>
Version and Serial Difference
---------------------------
Versions:
1. store into file.
2. store into sqlite.
3. store into file or sqlite.
3.1 simple store by using only get method. '`&stype=ss`'
4. store into mysql.

Serials:
- v - for development version
- s - for stable version

<br><br>
How to use (regular)
--------------------
### Param:
* **stype** [GET][POST]: stand for store type.
> `&stype=sqlite` (default) will store data into sqlite db.
>
> `&stype=file` will store data into file.
>
> &stype=mysql (`not support yet`) will store data into file.

> simple GET storage:
>
> this is a simplified storage type to store and retrive data with use only HTTP/1.1 GET METHOD.
>
> `&stype=ss` , `&stype=simplestore` or `&stype=simple_store` will:
> 1. `&setmsg=you_xyz_data` will urldecode $_GET['setmsg'] data and store into sqlite.
> 2. `&getmsg=1`, `&getmsg=true` or `&getmsg=getmsg` will get raw data back.
>
>


* **ctype** [GET]: stand for content type for GET.
> `&ctype=json` (default) will return json structured data with status code. Sqlite will also store metadatas such as date, time, meta etc automatically.
>
> `&ctype=raw` will return raw data. (only for get, post will always raw)
>

* **passcode**: defined in php. use like token, need to pass for every call.
* **username**: any string. v1 will use it as folder name. v2 will put into `note.username` colume.
* **hash**: any string. v1 will use it as file name. v2 will put into `note.hash` colume.
* **type**: recorde type. will record into DB `type` colume.
* **meta**: a hack. Pass by using `{'meta':'your data'}` inside post body.

<br><br>
### Examples:
Set example
~~~~
POST: http://api.lluo.dev/storage/v3/?passcode=pass1234&username=luolisave@gmail.com&hash=16&stype=file&ctype=raw

body:
{
  "anything":"anything",
  "note":"set.php version 2 a"
}
~~~~


Get example:
~~~~
GET:  http://api.lluo.dev/storage/v3/?passcode=pass1234&username=luolisave@gmail.com&hash=16&stype=file&ctype=raw

response:
{
  "anything":"anything x",
  "note":"set x"
}
~~~~

Set example 2: simple_sotre
~~~~
GET http://api.lluo.dev/storage/v3.1/?passcode=pass1234&username=luolisave@gmail.com&hash=16&stype=simple_store&ctype=raw&setmsg=this_is_my_message

response:
putmsg: data updated to db successfully.
~~~~

Get example 2: simple_store
~~~~
GET http://api.lluo.dev/storage/v3.1/?passcode=pass1234&username=luolisave@gmail.com&hash=16&stype=simple_store&ctype=raw&getmsg=true

response:
this_is_my_item
~~~~


Upload file
------------
~~~~
    GET http://api.lluo.dev/storage/v3.x/index.php?upload=upload&passcode=pass1234&username=luolisave@gmail.com&hash=1
  then submit(post) to same url:
    POST http://api.lluo.dev/storage/v3.x/index.php?upload=upload&passcode=pass1234&username=luolisave@gmail.com&hash=1#
~~~~

email.php
----------
~~~~
    POST http://api.lluo.dev/storage/v3.x/index.php?passcode=pass1234&hash=na&username=na&email=email

    {
      "email_from":"test@lluo.ca",
      "email_to":"luolisave@gmail.com",
      "email_subject":"test email subject.",
      "email_content":"1. test email body.\r\n  2. second line. \r\n 3.haha."
    }
~~~~

<br><br><br><br>
Virtual Host Setup
==================
~~~~
192.168.135.211		api.lluo.dev
~~~~
~~~~
<VirtualHost *:80>
    DocumentRoot "C:\Users\lluo\OneDrive\dev\php\api"
    ServerName api.lluo.dev

    <Directory "C:\Users\lluo\OneDrive\dev\php\api">
        Options Indexes FollowSymLinks MultiViews
        AllowOverride all
        Order Deny,Allow
        Allow from all
        Require all granted
    </Directory>
</VirtualHost>
~~~~
