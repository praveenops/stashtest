export const PROFILER = {
  METADATA: {
    datasetDefaults: {
      '1': {
        id: '5a8e670906b89b2b14353b68',
        connection: {
          port: 9999,
          host: '10.247.4.168',
          token: 'c0b6ba246a154bf3ab451da56f4c1506'
        },
        domainModelName: 'Innovations_Profiler',
        datasetId: 1,
        defaults: {
          factContext: {
            markets: {
              name: 'HMSM + DRIVE + SDMP',
              id: '1260419'
            },
            manufacturers: [
              {
                name: 'BIC',
                id: '241256',
                type: 'Manufacturer Level'
              },
              {
                name: 'PHILIPS',
                id: '241031',
                type: 'Manufacturer Level'
              },
              {
                name: 'PROCTER & GAMBLE / GILLETTE',
                id: '605702',
                type: 'Manufacturer Level'
              },
              {
                name: 'EDGEWELL PERSONAL CARE',
                id: '60162258',
                type: 'Manufacturer Level'
              }
            ],
            innovationThreshold: {
              name: '1% Distribution',
              id: '1'
            },
            innovationPeriod: {
              name: '1 Year',
              id: '1'
            },
            factType: {
              name: 'Value Sales',
              id: '1'
            },
            timePeriod: {
              name: 'Latest 52 Weeks',
              id: '4',
              type: 'Period_Group_Level'
            },
            categories: [
              [
                {
                  name: 'RAZORS & BLADES',
                  id: '54763895',
                  type: 'Category Level'
                }
              ]
            ],
            innovationTypes: [
              {
                name: 'New Brand/Brand Extension',
                id: '-1170661728'
              },
              {
                name: 'Line Extension',
                id: '-1170661725'
              },
              {
                name: 'New Sub-Brand',
                id: '-1170661726'
              },
              {
                name: 'Temporary',
                id: '-1170661727'
              }
            ],
            id: '5ad0480b5f3e702935e5c673',
            type: 'DEFAULT'
          }
        },
        pdm: {
          name: 'bicPDM'
        },
        name: 'Innovations_Profiler_Agg',
        current: true,
        category: 'RAZOR & BLADES',
        country: 'FR'
      },
    },
    datasetMetadata: {
      '1': [
        {
          'categories': [
            {
              'name': 'RAZORS & BLADES',
              'id': '54763895',
              'type': 'Category Level',
              'children': [
                {
                  'name': 'BIKINI TRIMMER',
                  'id': '48646655',
                  'type': 'Segment Level'
                },
                {
                  'name': 'RAZOR',
                  'id': '48646657',
                  'type': 'Segment Level'
                },
                {
                  'name': 'RAZOR BLADE',
                  'id': '48646658',
                  'type': 'Segment Level'
                }
              ]
            }
          ],
          'manufacturers': [
            {
              'name': 'BIC',
              'id': '241256',
              'type': 'Manufacturer Level',
              'children': [
                {
                  'name': 'BIC',
                  'id': '241243',
                  'type': 'Brand Level',
                  'children': [
                    {
                      'name': 'BIC',
                      'id': '29686841',
                      'type': 'Sub Brand Level'
                    },
                    {
                      'name': 'BIC 1',
                      'id': '51895342',
                      'type': 'Sub Brand Level'
                    }
                  ]
                },
                {
                  'name': 'BIC COMFORT',
                  'id': '28739690',
                  'type': 'Brand Level',
                  'children': [
                    {
                      'name': 'BIC COMFORT 2',
                      'id': '51895313',
                      'type': 'Sub Brand Level'
                    },
                    {
                      'name': 'BIC COMFORT 3',
                      'id': '54756221',
                      'type': 'Sub Brand Level'
                    }
                  ]
                }
              ]
            },
            {
              'name': 'EDCO',
              'id': '241258',
              'type': 'Manufacturer Level',
              'children': [
                {
                  'name': 'SMOOTH SHAVE',
                  'id': '19659233',
                  'type': 'Brand Level',
                  'children': [
                    {
                      'name': 'SMOOTH SHAVE',
                      'id': '51896134',
                      'type': 'Sub Brand Level'
                    }
                  ]
                }
              ]
            }
          ],
          'periods': [
            {
              'id': '4',
              'name': 'Latest 52 Weeks',
              'type': 'Period_Group_Level',
              'lastPeriodDate': '2017-01-29 05:00:00.000'
            }
          ],
          'markets': [
            {
              'id': '1260419',
              'name': 'HMSM + DRIVE + SDMP'
            }
          ],
          'innovationTypes': [
            {
              'id': '-1170661725',
              'name': 'Line Extension'
            },
            {
              'id': '-1170661728',
              'name': 'New Brand/Brand Extension'
            },
            {
              'id': '-1170661727',
              'name': 'Temporary'
            },
            {
              'id': '-1170661726',
              'name': 'New Sub-Brand'
            }
          ],
          'innovationPeriods': [
            {
              'id': '1',
              'name': '1 Year'
            }
          ],
          'innovationThresholds': [
            {
              'id': '1',
              'name': '1% Distribution'
            }
          ],
          'factTypes': [
            {
              'id': '1',
              'name': 'Value Sales'
            },
            {
              'id': '2',
              'name': 'Unit Sales'
            },
            {
              'id': '3',
              'name': 'Eq. Unit Sales'
            }
          ]
        }
      ]
    },
    defaultMetadata: [
      {
        'datasetId': 1,
        'defaults': {
          'factContext': {
            'categories': [
              [{
                'id': '54763895',
                'name': 'RAZORS & BLADES',
                'type': 'Category Level'
              }
              ]],
            'manufacturers': [
              {
                'id': '241256',
                'name': 'BIC',
                'type': 'Manufacturer Level'
              },
              {
                'id': '241031',
                'name': 'PHILIPS',
                'type': 'Manufacturer Level'
              },
              {
                'id': '605702',
                'name': 'PROCTER & GAMBLE / GILLETTE',
                'type': 'Manufacturer Level'
              },
              {
                'id': '60162258',
                'name': 'EDGEWELL PERSONAL CARE',
                'type': 'Manufacturer Level'
              }
            ],
            'innovationTypes': [
              {
                'id': '-1170661725',
                'name': 'Line Extension'
              },
              {
                'id': '-1170661728',
                'name': 'New Brand'
              },
              {
                'id': '-1170661726',
                'name': 'New Sub-Brand'
              },
              {
                'id': '-1170462563',
                'name': 'Brand Extension'
              },
              {
                'id': '-1170661727',
                'name': 'Temporary'
              }
            ]
          }
        }

      },
      {
        'datasetId': 2,
        'defaults': {
          'factContext': {
            'categories': [
              [{
                'id': '63357743',
                'name': 'BEER',
                'type': 'Category Level'
              }
              ]],
            'manufacturers': [
              {
                'id': '68667215',
                'name': 'MOLSON COORS',
                'type': 'Manufacturer Level'
              },
              {
                'id': '68667864',
                'name': 'ANHEUSER BUSCH INBEV',
                'type': 'Manufacturer Level'
              },
              {
                'id': '68667387',
                'name': 'HEINEKEN',
                'type': 'Manufacturer Level'
              },
              {
                'id': '68667388',
                'name': 'CARLSBERG',
                'type': 'Manufacturer Level'
              }
            ],
            'innovationTypes': [
              {
                'id': '-1170462662',
                'name': 'Line Extension'
              },
              {
                'id': '-1170462665',
                'name': 'New Brand'
              },
              {
                'id': '-1170462663',
                'name': 'New Sub-Brand'
              },
              {
                'id': '-1170462576',
                'name': 'Brand Extension'
              },
              {
                'id': '-1170462664',
                'name': 'Temporary'
              }
            ]
          }
        }
      }
    ]
  },
  TEST_DATA: {
    dashboardComponent: [
      {
        'country': 'FR',
        'datasets': [
          {
            'name': 'Innovations_Profiler',
            'datasetId': 1,
            'category': 'RAZOR & BLADES'
          },
          {
            'name': 'Innovations_Profiler-2',
            'datasetId': 3,
            'category': 'RAZOR & BLADES 2'
          }
        ]
      },
      {
        'country': 'GB',
        'datasets': [
          {
            'name': 'Innovations_Profiler_Molson',
            'datasetId': 2,
            'category': 'BEER & CIDER'
          }
        ]
      }
    ]
  },
  EDIT_CONTEXT: {
    categories : [
      [
        {
          'id': '49563175',
          'name': 'SPORT & ENERGY DRINKS',
          'type': 'Category Level'
        }
      ],
      [
        {
          'id': '-1073162',
          'name': 'TEA & INFUSIONS RTD',
          'type': 'Category Level'
        }
      ],
      [
        {
          'id': '49482046',
          'name': 'WATER',
          'type': 'Category Level'
        }
      ]
    ],
    category_single_selection : [
      [
        {
          'id': '49563175',
          'name': 'SPORT & ENERGY DRINKS',
          'type': 'Category Level'
        }
      ]
    ],
    context_with_segments: [
      [
        {
          'id': '49563175',
          'name': 'SPORT & ENERGY DRINKS',
          'type': 'Category Level'
        },
        {
          'id': '34628077',
          'name': 'CARBONATED',
          'type': 'Segment Level'
        }
      ],
      [
        {
          'id': '49482046',
          'name': 'WATER',
          'type': 'Category Level'
        }
      ]
    ],
    segment: [
      [
        {
          'id': '49563175',
          'name': 'SPORT & ENERGY DRINKS',
          'type': 'Category Level'
        },
        {
          'id': '34628077',
          'name': 'CARBONATED',
          'type': 'Segment Level'
        }
      ]
    ]
  }
};
