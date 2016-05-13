currentLanguage = "en"

messages = messages? or {};

__ = (key)->
  return messages[currentLanguage]?[key] or key
