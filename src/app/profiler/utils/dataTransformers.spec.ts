import * as dataTranformerFunc from './dataTransformers';
import { ProfilerChartData } from '../../shared/mockdata/profiler.chart.mockdata';
import { Utils } from '../../shared/utils/utils';


describe('dataTranformers functions (Test_Ids C570786, 87, 88, 89, C570801)', () => {

    describe(`Test the transform functions`, () => {
        let givenData, convertedData, expectedData;
        beforeEach(() => {
            givenData = ProfilerChartData.mockData.factShare.givenData;
        });

        it('Should convert data as per Innovation-to-Market data', () => {
            convertedData = dataTranformerFunc.convertDataInnovationToMarket(givenData);
            expectedData = ProfilerChartData.mockData.innovationToMarket.expectedData;
            expect(convertedData).toEqual(expectedData);
        });

        it('Should convert data as per Market-Innovation-Share data', () => {
            expectedData = ProfilerChartData.mockData.marketInnovationShare.expectedData;
            convertedData = dataTranformerFunc.convertDataMarketInnovationShare(givenData);
            expect(convertedData).toEqual(expectedData);
        });

        it('Should convert data as per Innovation-Contribution data', () => {
            expectedData = ProfilerChartData.mockData.innovationContribution.expectedData;
            convertedData = dataTranformerFunc.convertDataInnovationContributing(givenData);
            expect(convertedData).toEqual(expectedData);
        });

        it('Should convert data as per Itemperformance data and Item performance domain range', () => {
            expectedData = ProfilerChartData.mockData.performanceData.expectedData;
            const expectedDomainRange = ProfilerChartData.mockData.performanceData.expectedDomainRange;
            const givenDataPerformance = ProfilerChartData.mockData.factPerformance.givenData;
            convertedData = dataTranformerFunc.convertDataItemPerformance(givenDataPerformance);
            const convertedDomainRange = dataTranformerFunc.getIPDomainRange(convertedData);
            expect(convertedData).toEqual(expectedData);
            expect(convertedDomainRange).toEqual(expectedDomainRange);
        });

        it('Should convert data as per Itemperformance-Gap data', () => {
            expectedData = ProfilerChartData.mockData.itemPerformanceGapData.expectedData;
            convertedData = dataTranformerFunc.convertDataItemPerformanceGap(givenData);
            expect(convertedData).toEqual(expectedData);
        });

        it('Should convert data as per Itemperformance-Average-Sales data', () => {
            expectedData = ProfilerChartData.mockData.itemPerformanceAverageSalesData.expectedData;
            convertedData = dataTranformerFunc.convertDataItemPerformanceAverageSale(givenData);
            expect(convertedData).toEqual(expectedData);
        });

        it('Should convert data as per Activity-Intensity data', () => {
            expectedData = ProfilerChartData.mockData.activityIntensityData.expectedData;
            convertedData = dataTranformerFunc.convertDataActivityIntensity(givenData);
            expect(convertedData).toEqual(expectedData);
        });

        it('Should convert data as per Data-Column-Type data', () => {
            const givenDataInnovationType = ProfilerChartData.mockData.factInnvationTypeShare.givenData;
            expectedData = ProfilerChartData.mockData.innovationTypeData.expectedData;
            convertedData = dataTranformerFunc.convertDataColumnType(givenDataInnovationType, 'innovationTypes');
            expect(convertedData).toEqual(expectedData);
        });

        it('Should convert data as per Innovation Characteristics data', () => {
            const givenDataInnovationCharacteristics = ProfilerChartData.mockData.factTopTenCharacteristicsData.givenData;
            expectedData = ProfilerChartData.mockData.topTenCharacteristicsData.expectedData;
            const expecpectedColumnArray = ProfilerChartData.mockData.topTenCharacteristicsData.expecpectedColumnArray;
            convertedData = dataTranformerFunc.convertDataInnovationCharacteristics(givenDataInnovationCharacteristics);
            expect(convertedData.data).toEqual(expectedData);
            expect(convertedData.columnArray).toEqual(expecpectedColumnArray);
        });

        it('Should test refactorCategoryTitles', () => {
            const givenCategoryData = [
                    [
                        {
                            name: 'WATER',
                            id: '49482046',
                            type: 'Category Level'
                        },
                        {
                            name: 'BLE',
                            id: '49482047',
                            type: 'Segment Level'
                        }
                    ],
                    [
                        {
                            name: 'RAZOR',
                            id: '49482048',
                            type: 'Category Level'
                        },
                        {
                            name: 'BLADE',
                            id: '49482049',
                            type: 'Segment Level'
                        }
                    ]
                ];
            expectedData = {
                title: 'Water / Ble + 1',
                hasExtraSelection: true,
                hintText: 'WATER / BLE - RAZOR / BLADE'
            };
            const expectedEmptyTitle = {
                    title: '',
                    hasExtraSelection: false,
                    hintText: '',
                 };
            convertedData = dataTranformerFunc.refactorCategoryTitles(givenCategoryData);
            const convertedEmptyTitle = dataTranformerFunc.refactorCategoryTitles([]);
            expect(convertedData).toEqual(expectedData);
            expect(convertedEmptyTitle).toEqual(expectedEmptyTitle);
        });
        it('Should test calculateScaleFactor function', () => {
            const width = 60, textWidth = 30;
            convertedData = dataTranformerFunc.calculateScaleFactor(width, textWidth);
            const expectedValue = 0.5;
            expect(convertedData).toEqual(expectedValue);
        });
    });

    describe('Should test helper functions', () => {
        describe('Should test getCurrency function', () => {
            it('Should test getCurrency function with valid value', () => {
                const currencyCode = 'USD';
                const expectedCurrency = '$';
                const currency = dataTranformerFunc.getCurrency(currencyCode);
                expect(currency).toEqual(expectedCurrency);
            });
            it('Should test getCurrency function with invalid value', () => {
                const currencyCodeUndefined = undefined;
                const currencyCodeInvalid = 'ASADAF';
                const expectedCurrency = '';
                let currency = dataTranformerFunc.getCurrency(currencyCodeUndefined);
                expect(currency).toEqual(expectedCurrency);
                currency = dataTranformerFunc.getCurrency(currencyCodeInvalid);
                expect(currency).toEqual(expectedCurrency);
            });
        });
        describe('Should test checkCurrencyWithFactType function', () => {
            it('Should test checkCurrencyWithFactType function with valid value', () => {
                const factType = 'Value Sales';
                const result = dataTranformerFunc.checkCurrencyWithFactType(factType);
                expect(result).toEqual(true);
            });
            it('Should test checkCurrencyWithFactType function with invalid value', () => {
                const factType = 'Unit Sales';
                const result = dataTranformerFunc.checkCurrencyWithFactType(factType);
                expect(result).toEqual(false);
            });
        });
    });
});

describe(`Should call Util's sort method`, () => {
    let givenData;

    beforeEach(() => {
        givenData = ProfilerChartData.mockData.factShare.givenData;
        const cat = jasmine.createSpy('refactorCategoryTitles');
    });
    it(`on 'convertDataMarketInnovationShare' function`, () => {
        const spy = spyOn<any>(Utils, 'convertInTitle');
        dataTranformerFunc.convertDataMarketInnovationShare(givenData);
        expect(spy).toHaveBeenCalled();
    });

    it(`on 'convertDataInnovationToMarket' function`, () => {
        const spy = spyOn<any>(Utils, 'convertInTitle');
        dataTranformerFunc.convertDataInnovationToMarket(givenData);
        expect(spy).toHaveBeenCalled();
    });

    it(`on 'convertDataInnovationContributing' function`, () => {
        const spy = spyOn<any>(Utils, 'convertInTitle');
        dataTranformerFunc.convertDataInnovationContributing(givenData);
        expect(spy).toHaveBeenCalled();
    });

    it(`on 'convertDataActivityIntensity' function`, () => {
        const spy = spyOn<any>(Utils, 'convertInTitle');
        dataTranformerFunc.convertDataActivityIntensity(givenData);
        expect(spy).toHaveBeenCalled();
    });

    it(`on 'convertDataItemPerformanceGap' function`, () => {
        const spy = spyOn<any>(Utils, 'convertInTitle');
        dataTranformerFunc.convertDataItemPerformanceGap(givenData);
        expect(spy).toHaveBeenCalled();
    });

    it(`on 'convertDataItemPerformanceAverageSale' function`, () => {
        const spy = spyOn<any>(Utils, 'convertInTitle');
        dataTranformerFunc.convertDataItemPerformanceAverageSale(givenData);
        expect(spy).toHaveBeenCalled();
    });

    it(`on 'refactorCategoryTitles' function`, () => {

        const givenCategoryData = [
            [
                {
                    name: 'WATER',
                    id: '49482046',
                    type: 'Category Level'
                },
                {
                    name: 'BLE',
                    id: '49482047',
                    type: 'Segment Level'
                }
            ],
            [
                {
                    name: 'RAZOR',
                    id: '49482048',
                    type: 'Category Level'
                },
                {
                    name: 'BLADE',
                    id: '49482049',
                    type: 'Segment Level'
                }
            ]
        ];
        const spy = spyOn<any>(Utils, 'convertInTitle');
        dataTranformerFunc.refactorCategoryTitles(givenCategoryData);
        expect(spy).toHaveBeenCalled();
    });

    it(`on 'convertDataInnovationCharacteristics' function should convert title,sub-title,tooltip in title-case`, () => {
        const spy = spyOn<any>(Utils, 'convertInTitle');
        const data = {
            itemCount: 1710,
            innovationItemCount: 175,
            characteristics: [
                {
                    id: 1234,
                    value: 'Swivel Head',
                    name: 'Global razor head type',
                    itemShare: 54,
                    innovationItemShare: 92
                }
            ]};
        dataTranformerFunc.convertDataInnovationCharacteristics(data);
        expect(spy).toHaveBeenCalledTimes(3);
    });

});
