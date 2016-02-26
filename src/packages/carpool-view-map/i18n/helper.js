messages = {
		page_title: {en:"TakeMeHome", lt:"Vežu Važiuoju"}
}

function getBrowserLocale() {
  var l_lang;
  if (navigator.userLanguage) // Explorer
    l_lang = navigator.userLanguage;
  else if (navigator.language) // FF
    l_lang = navigator.language;
  else
    l_lang = "en";
  return l_lang 
}

Handlebars.registerHelper('t',function(key) {
	//d("Browswer locale:"+getBrowserLocale());
	locale = "lt";
	return messages[key][locale] || "Ups";
});