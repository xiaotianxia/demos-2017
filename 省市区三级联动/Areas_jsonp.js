function Areas(province, city, county) {
   this.$province = $(province);
   this.$city = $(city);
   this.$county = $(county);

   this.isCity = city && city.length;
   this.isCounty = county && county.length;

   this.domain = 'http://www.bobo.com/user';

   this.cityCache = {};
   this.countyCache = {};
      
   this.init();
   this.bindEvent();
}

Areas.prototype.init = function() {
   this.renderProvinces();
   if(this.isCity) {
      this.renderCities(1);
   }
}

Areas.prototype.bindEvent = function() {
   var self = this;
   this.$province.change(function() {
      var v = $(this).val();
      if (v == "32" || v == "33" || v == "34" || v == "35") {
         self.$city.html('<option value="0"></option>').attr('disabled', 'disabled');
         self.$county && self.$county.html('<option value="0"></option>').attr('disabled', 'disabled');
         return;
      };
      self.$city.removeAttr('disabled');
      self.$county && self.$county.removeAttr('disabled');
      self.renderCities(v);
   });

   this.$city.change(function() {
      var v = $(this).val();
      self.renderCounties( v);
   });
}

Areas.prototype.renderProvinces = function() {
   var provinceArray = [],
       self = this;
   $.ajax({
      url: this.domain + '/getprovinces.do?var=provinceData',
      type: 'GET',
      dataType: 'script',
      success: function() {
         for (var i = 0; i < provinceData.provinces.length; i++) {
            provinceArray.push("<option value='" + provinceData.provinces[i].pid + "'>" + provinceData.provinces[i].province + "</option>");
         }
      self.$province.append(provinceArray.join(""));
      }
   })
}

Areas.prototype.renderCities = function(pid) {
   var cityArray = [],
       self = this;
   if(this.cityCache[pid]) {
      var cities = this.cityCache[pid].cities;
      for (var i = 0, len = cities.length; i < len; i++) {
         cityArray.push("<option value='" + cities[i].cid + "'>" + cities[i].city + "</option>");
      };
      this.$city.find("option").remove();
      this.$city.append(cityArray.join(""));
      if(!this.isCounty) { return; }
      var c = this.$city.find('> option').eq(0).val();
      this.renderCounties(c);
   } else {
      $.ajax({
         url: this.domain + '/getcities.do?var=cityData&pid=' + pid,
         type: 'GET',
         dataType: 'script',
         success: function() {
            self.cityCache[pid] = cityData;
            for (var i = 0; i < cityData.cities.length; i++) {
               cityArray.push("<option value='" + cityData.cities[i].cid + "'>" + cityData.cities[i].city + "</option>");
            };
            self.$city.find("option").remove();
            self.$city.append(cityArray.join(""));
            if(!self.isCounty) { return; }
            var c = self.$city.find('> option').eq(0).val();
            self.renderCounties(c);
         }
      })
   }
}

Areas.prototype.renderCounties = function(cid) {
   if(!this.isCounty) { return; }
   var countyArray = [],
       self = this;
   if(this.countyCache[cid]) {
      var counties = this.countyCache[cid].areas;
      for (var i = 0, len = counties.length; i < len; i++) {
         countyArray.push("<option value='" + counties[i].aid + "'>" + counties[i].area + "</option>");
      };
      this.$county.find("option").remove();
      this.$county.append(countyArray.join(""));
   } else {
      $.ajax({
         url: this.domain + '/getareas.do?var=countyData&cid=' + cid,
         type: 'GET',
         dataType: 'script',
         success: function() {
            self.countyCache[cid] = countyData;
            for (var i = 0; i < countyData.areas.length; i++) {
               countyArray.push("<option value='" + countyData.areas[i].aid + "'>" + countyData.areas[i].area + "</option>");
            };
            self.$county.find("option").remove();
            self.$county.append(countyArray.join(""));
         }
      })
   }
}

