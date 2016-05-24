class @Progress
  constructor: ()->
    @progress = {}

  setProgress: (action, progress)->
    if progress == 100
      delete @progress[action]
    else
      @progress[action] = progress
    @getProgress();

  getProgress: ()->
    sum = 0
    total = 0
    _.each @progress, (item) ->
      sum += item
      total += 100
    #d "Sum #{sum}/#{total}", @progress
    if sum == 0
      if total == 0
        return 100;
      else
        return 0;
    else
      return sum / total

  isReady: ()->
    return getProgress == 0
