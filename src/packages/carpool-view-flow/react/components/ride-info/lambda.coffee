exports.L_mapAndWrap = (arr, mapping, first, middle, last)=>
  result = [];
  if arr[0]
    result.push mapping(arr[0], first)
  i = 1
  while i < arr.length - 1
    routePoint = arr[i]
    result.push mapping(routePoint, middle)
    i++
  if arr.length > 1
    result.push mapping(arr[arr.length - 1], last)
  return result;
