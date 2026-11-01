import moment from 'moment';

export default {
  api: 'https://api.mowgosnowgo.com',
  facebookAppID: '2038975489690673',
  googlePlacesApiKey: '', // set your Google Places API key,
  service: {
    minDate: moment().add(2, 'd').format('YYYY-MM-DD'),
    maxDate: moment().add(90, 'd').format('YYYY-MM-DD'),
    operationsCenter: '43.502636, -80.380797',
    operationsRadius: 30000,
    tax: 0.13,
    type: [
      {
        label: 'Grass Cutting',
      },
      {
        label: 'Snow Removal',
      },
      {
        label: 'Yard Clean Up',
        custom: true,
      },
      {
        label: 'Mulching',
        custom: true,
      },
      {
        label: 'Sodding',
        custom: true,
      },
      {
        label: 'Lawn Rehabilitation',
        custom: true,
      },
      {
        label: 'Dump Run',
        custom: true,
      },
      {
        label: 'Other',
        custom: true,
      },
    ],
    size: {
      'Grass Cutting': [
        {
          label: 'Small',
          description: 'less than 7,500',
          price: 40,
        },
        {
          label: 'Medium',
          description: '7,500 - 15,000',
          price: 55,
        },
        {
          label: 'Large',
          description: '15,000 - 25,000',
          price: 65,
        },
        {
          label: 'Extra Large',
          description: '25,000 or more',
          price: 85,
          custom: true,
        },
      ],
      'Snow Removal': [
        {
          label: 'Small',
          description: '4 or fewer cars',
          price: 50,
        },
        {
          label: 'Medium',
          description: '5 - 9 cars',
          price: 60,
        },
        {
          label: 'Large',
          description: '9 - 12',
          price: 70,
        },
        {
          label: 'Extra Large',
          description: '13 or more',
          price: 85,
          custom: true,
        },
      ],
    },
    extras: {
      'Grass Cutting': [
        {
          label: 'No access to large mower',
          multiplier: 0.25,
        },
        {
          label: 'Grass over 5 inches tall',
          multiplier: 0.50,
        },
        {
          label: 'Excessive debris on lawn',
          multiplier: 0.25,
        },
      ],
      'Snow Removal': [
        {
          label: 'Snow over one foot deep',
          multiplier: 0.25,
        },
        {
          label: 'Salting driveway, walkway & porch',
          multiplier: 0.25,
        },
      ],
    },
  },
};
