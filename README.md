BALANCE 1
======================

Copyright(c) 2017-2018 Suresh Tharuma All rights researved.

Creating Development Environment
--------------------------------

### Prerequisites ###

* mongodb
* node.js  
note: please use the following way to install node.js into ubuntu  

```shell
$ sudo apt-get install curl
$ curl -sL https://deb.nodesource.com/setup | sudo bash -  
$ sudo apt-get install nodejs  
```
* git

### Install ###

1. Install Development Tools (yo, bower, and grunt)
```shell
$ npm install --global yo bower grunt-cli
```

2. Download balanceApp from git  
```shell
$ git clone https://github.com/bioworldlab/balanceApp.git
```

3. Install Server-side Packages
```shell
$ npm install
```

4. Install Client-side Packages  
```shell
$ bower install
```

1. run mongodb

2.$ grunt serve
```

