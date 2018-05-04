

angular.module('opsVisionfilters', []).filter('decorateNumberVal', function(){
  return function (input, display_type, type) {
     if (!input) return input;
     if (isNaN(input)) return input;
     if (display_type === 'PERCENTAGE') {
        if (input === '0') return '0%';
		if (input % 1 == 0) decimals = 0;
		else if (type === 'UPTIME') decimals = 3;
        else decimals = 1;
        return input.toFixed(decimals) + '%';	 
     } else {
        decimals = 2;
        var factor = "1" + Array(+(decimals > 0 && decimals + 1)).join("0");
        return Math.round(input * factor) / factor;
     }
  };
}).filter('mapYear', function(){
      var yearHash = {
        2014: '2014',
        2015: '2015',
        2016: '2016',
        2017: '2017',
        2018: '2018',
        2019: '2019',
        2020: '2020'
      };
  
      return function(input) {
        if (!input){
          return '';
        } else {
          return yearHash[input];
        }
      };
}).filter('mapMonth', function(){
      var monthHash = {
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        7: '7',
        8: '8',
        9: '9',
        10: '10',
        11: '11',
        12: '12'
      };
  
      return function(input) {
        if (!input){
          return '';
        } else {
          return monthHash[input];
        }
      };
});;