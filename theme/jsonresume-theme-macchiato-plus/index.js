const fs = require('fs');
const handlebars = require('handlebars');
const handlebarsWax = require('handlebars-wax');
const moment = require('moment');

handlebars.registerHelper({
  removeProtocol: url => url.replace(/.*?:\/\//g, ''),
  concat: (...args) => args.filter(arg => typeof arg !== 'object').join(''),
  // Arguments: {address, city, subdivision, postalCode, countryCode}
  // formatAddress: (...args) => addressFormat(args).join(' '),
  formatAddress: (...args) => args.filter(arg => typeof arg !== 'object').join(' '),
  formatDate: date => 
  {
    // Check if the date is already a year format (4 digits only)
    if (date && /^\d{4}$/.test(date)) 
    {
      return date; // Return the year as is
    }
    
    // Otherwise, format as MM/YYYY
    return moment(date).format('MM/YYYY');
  },
  lowercase: s => s.toLowerCase(),
  eq: (a, b) => a === b,
  findIndex: (array, property, value) => 
  {
    for (let i = 0; i < array.length; i++) 
    {
      if (array[i][property] === value) 
      {
        return i;
      }
    }
    return -1;
  },
  json: (obj) => 
  {
    return JSON.stringify(obj);
  },
  getLabel: function(label, defaultValue) 
  {
    if (this.resume && this.resume.meta && this.resume.meta.labels) 
    {
      console.log(label);
      // Check if the requested label exists in labels
      if (this.resume.meta.labels[label]) 
      {
        return this.resume.meta.labels[label];
      }
    }
    // Return default value if no custom label found
    return defaultValue;
  }
});

function render(resume) {
  const dir = `${__dirname}/src`;
  const css = fs.readFileSync(`${dir}/style.css`, 'utf-8');
  const resumeTemplate = fs.readFileSync(`${dir}/resume.hbs`, 'utf-8');

  const Handlebars = handlebarsWax(handlebars);

  Handlebars.partials(`${dir}/partials/**/*.{hbs,js}`);

  return Handlebars.compile(resumeTemplate)({
    style: `<style>${css}</style>`,
    resume,
  });
}

module.exports = {
  render,
};
