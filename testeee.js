var obj = { first: "John", last: "Doe", test: '' };

Object.keys(obj).forEach(function(key) {
    

    if(obj[key] == ''){
        obj[key] = 'NA'

    }
    console.log(key, obj[key]);
});