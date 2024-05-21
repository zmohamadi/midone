'use client'

var Cookies = {
    
    set : function(name, value, options){

      // initialise the cookie data
      var data = [encodeURIComponent(name) + '=' + encodeURIComponent(value)];

      // check whether there are nay options
      if (options){

        // extend the data with the expiry date if necessary
        if ('expiry' in options){
          if (typeof options.expiry == 'number'){
            options.expiry = new Date(options.expiry * 1000 + +new Date);
          }
          data.push('expires=' + options.expiry.toGMTString());
        }

        // extend the data with the other options if necessary
        if ('domain' in options) data.push('domain=' + options.domain);
        if ('path'   in options) data.push('path='   + options.path);
        if ('secure' in options && options.secure) data.push('secure');

      }

      // set the cookie
      document.cookie = data.join('; ');

    },
    
    get : function(name, keepDuplicates){

      // initialise the list of values
      var values = [];

      // loop over the cookies
      var cookies = document.cookie.split(/; */);
      for (var i = 0; i < cookies.length; i ++){

        // if the cookie has the requested name, add its value to the list
        var details = cookies[i].split('=');
        if (details[0] == encodeURIComponent(name)){
          values.push(decodeURIComponent(details[1].replace(/\+/g, '%20')));
        }

      }

      // return the first value or all values as appropriate
      return (keepDuplicates ? values : values[0]);

    },
    
    clear : function(name, options){

      // clear the cookie
      if (!options) options = {};
      options.expiry = -86400;
      this.set(name, '', options);

    }

  };

export {Cookies};
