const fakeData = {
  'id0': {
    id: 'id0',
    from: 'Anatakalnio g. 13',
    to: 'PLC Akropolis',
    time: new Date(2016, 3, 11, 13, 30),
    role: 'driver',
    tripPage: 'MuiDriverTrip',
    requests: [{
      name: 'John',
      imageSource: 'http://lorempixel.com/200/200/people/8/',
    }, {
      name: 'Ana',
      imageSource: 'http://lorempixel.com/200/200/people/1/',
    }],
  },
  'id1': {
    from: 'Vokieciu g. 3',
    to: 'Zirmunu g. 77',
    time: new Date(2016, 3, 12, 17, 15),
    role: 'passenger',
    tripPage: 'MuiPassengerTrip',
    matchingTrips: [{
      name: 'Peter',
      imageSource: 'http://lorempixel.com/200/200/people/3/',
    }, {
      name: 'Monica',
      imageSource: 'http://lorempixel.com/200/200/people/9/',
    }],
  },
}

export default fakeData
