class APIFeatures {
  constructor(query, queryString = '') {
      this.query = query;
      this.queryString = queryString;
  }

  filter() {
      const queryObj = { ...this.queryString };

      const replaceFields = [
          { category: '{ "slug": "in" }', split: ',' },
          { min: '{ "sale": "gte" }' },
          { max: '{ "sale": "lte" }' },
          { facility: '{ "facility.code": "in" }', caseSensitive: 2, split: ',' },
          { size: '{ "size": "in" }', caseSensitive: 2, split: ',', replace: true },
          { material: '{ "material": "in" }', split: ',', replace: true },
          { name: '{ "name": "regex" }', replace: true, regexSensitive: true },
          { id: '{ "IdOrder": "regex" }', replace: true, regexSensitive: true },
      ];

      replaceFields.forEach((el) => {
          const el_key = Object.keys(el)[0];

          if (queryObj[el_key]) {
              const el_value = JSON.parse(Object.values(el)[0]);

              const options = el.regexSensitive ? { "options": 'i' } : '';

              if (el.caseSensitive) {
                  queryObj[el_key] =
                      el.caseSensitive === 1
                          ? queryObj[el_key].toLowerCase()
                          : queryObj[el_key].toUpperCase();
              }

              if (el.split) {
                  queryObj[el_key] = queryObj[el_key].split(el.split);
              }

              if (el.replace) {
                  queryObj[Object.keys(el_value)] = {
                      [Object.values(el_value)]: queryObj[el_key],
                      ...options
                  };
              }
              else {
                  queryObj[Object.keys(el_value)] = {
                      ...queryObj[Object.keys(el_value)],
                      [Object.values(el_value)]: queryObj[el_key],
                      ...options
                  };
              }
          }
      });
      
      const excludedFields = ['offset', 'sort', 'limit', 'fields', 'category', 'min', 'max', 'facility'];
      excludedFields.forEach((el) => delete queryObj[el]);
      
      const queryStr = JSON.stringify(queryObj).replace(/\b(gte|gt|lte|lt|eq|in|regex|options)\b/g, (match) => `$${match}`);
      this.query = this.query.find(JSON.parse(queryStr)).collation({ locale: 'vi', numericOrdering: true });

      return this;
  }

  getTotal() {
      const queryObj = { ...this.queryString };

      const replaceFields = [
          { category: '{ "slug": "in" }', split: ',' },
          { min: '{ "sale": "gte" }' },
          { max: '{ "sale": "lte" }' },
          { facility: '{ "facility.code": "in" }', caseSensitive: 2, split: ',' },
          { size: '{ "size": "in" }', caseSensitive: 2, split: ',', replace: true },
          { material: '{ "material": "in" }', split: ',', replace: true },
          { name: '{ "name": "regex" }', replace: true, regexSensitive: true },
      ];

      replaceFields.forEach((el) => {
          const el_key = Object.keys(el)[0];

          if (queryObj[el_key]) {
              const el_value = JSON.parse(Object.values(el)[0]);

              const options = el.regexSensitive ? { "options": 'i' } : '';

              if (el.caseSensitive) {
                  queryObj[el_key] =
                      el.caseSensitive === 1
                          ? queryObj[el_key].toLowerCase()
                          : queryObj[el_key].toUpperCase();
              }

              if (el.split) {
                  queryObj[el_key] = queryObj[el_key].split(el.split);
              }

              if (el.replace) {
                  queryObj[Object.keys(el_value)] = {
                      [Object.values(el_value)]: queryObj[el_key],
                      ...options
                  };
              }
              else {
                  queryObj[Object.keys(el_value)] = {
                      ...queryObj[Object.keys(el_value)],
                      [Object.values(el_value)]: queryObj[el_key],
                      ...options
                  };
              }
          }
      });
      
      const excludedFields = ['offset', 'sort', 'limit', 'fields', 'category', 'min', 'max', 'facility'];
      excludedFields.forEach((el) => delete queryObj[el]);
      
      const queryStr = JSON.stringify(queryObj).replace(/\b(gte|gt|lte|lt|eq|in|regex|options)\b/g, (match) => `$${match}`);
      this.query = this.query.countDocuments(JSON.parse(queryStr)).collation({ locale: 'vi', numericOrdering: true });

      return this;
  }

  sort() {
      if (this.queryString.sort) {
          const sortBy = this.queryString.sort.split(',').join(' ');
          this.query = this.query.sort(sortBy).collation({ locale: 'vi', numericOrdering: true });
      } else this.query = this.query.sort('-create_at');

      return this;
  }

  limitFields() {
      try {
          if (this.queryString.fields) {
              const fields = this.queryString.fields.split(',').join(' ');
              this.query = this.query.select(fields).lean();
          } else this.query = this.query.select('-__v -other_img').lean();

          return this;
      } catch (e) {
          console.log(e);
      }
  }

  paginate() {
      const offset = this.queryString.offset * 1 || 1;
      const limit = this.queryString.limit * 1 || {};

      const skip = (offset - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);

      return this;
  }
}

module.exports = APIFeatures;
