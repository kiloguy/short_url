A simple implementation of URL shortener.

Using:
* PHP (and mysqli connector for mysql)
* MySQL

For Nginx server, add following rewrite rule into the server block in config file:
```
rewrite ^/([a-zA-Z0-9]+)$ /?id=$1 last;
```

[Demo site](https://s.kiloapp.cc)
