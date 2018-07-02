import { Utils } from '../../shared/utils/utils';
import { CURRENCY_SYMBOL } from '../../shared/constants/currencies-constant';

function createCatFirst(obj, arr): Array<any> {
  return [obj, ...arr];
}

function sortArray(arr, key) {
  return arr.sort(
    (a, b) => a[key] && a[key].toLowerCase().localeCompare(b[key].toLowerCase())
  );
}

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function divideFunc(divider, divisor) {
  return divider && divisor ? divider / divisor : 0;
}

export function checkCurrencyWithFactType(factType) {
  return factType && factType === 'Value Sales';
}

export function refactorCategoryTitles(categories: Array<any>) {
  if (Array.isArray(categories) && categories.length) {
    if (Array.isArray(categories[0]) && categories[0].length) {
      const catTitle = categories[0][1]
        ? categories[0][0].name + ' / ' + categories[0][1].name
        : categories[0][0].name;
      const titleWithSegments = categories.reduce((acc, curr, currIndex) => {
        if (currIndex) {
          return (acc +=
            ' - ' +
            (curr.length > 1
              ? curr[0].name + ' / ' + curr[1].name
              : curr[0].name));
        } else {
          return (acc +=
            curr.length > 1
              ? curr[0].name + ' / ' + curr[1].name
              : curr[0].name);
        }
      }, '');
      return {
        title:
          categories.length > 1
            ? Utils.convertInTitle(catTitle) + ' + ' + (categories.length - 1)
            : Utils.convertInTitle(catTitle),
        hasExtraSelection: categories.length > 1,
        hintText: categories.length > 1 ? titleWithSegments : ''
      };
    }
  }
  return {
    title: '',
    hasExtraSelection: false,
    hintText: ''
  };
}

function checkAndUpdateScale(arr) {
  let max = 0;
  let factor = 1;
  let result = arr;
  arr.forEach(item => {
    max = item.value[0] > max ? item.value[0] : max;
  });
  let divider = 100;
  while (max / divider > 1) {
    factor = max / divider > 1 ? factor + 0.5 : factor;
    divider += 50;
  }
  if (factor > 1) {
    result = arr.reduce(
      (acc, curr) =>
        acc.concat({
          ...curr,
          value: curr.value.length > 0 ? [curr.value / factor] : []
        }),
      []
    );
  }
  return result;
}

function createColumnArray(arr) {
  return arr.map(element => ({
    name: element.name,
    shortName: element.shortName
  }));
}

function getDisplayValueDecimal(value) {
  if (value > 0 && value < 100) {
    const fixedValue = value.toFixed(1);
    return fixedValue > 0 ? fixedValue : 0;
  }
  return value.toFixed(0);
}

const maxCallback = (acc, curr) => Math.max(acc, curr);

export function convertDataMarketInnovationShare(data) {
  if (data && data.manufacturers) {
    const maxValue = data.manufacturers
      .map(el => Math.max(el.marketSales, el.innovationSales))
      .reduce(maxCallback, -Infinity);
    const arr = data.manufacturers.reduce(
      (acc, curr, currIndex) =>
        acc.concat({
          chipIndex: 'chip' + (currIndex + 1),
          id: curr.id,
          title: Utils.convertInTitle(curr.name),
          subtitle: curr.levelShortName,
          value: [
            divideFunc(curr.marketSales, maxValue) * 100,
            divideFunc(curr.innovationSales, maxValue) * 100
          ],
          isClickable: curr.innovationItemCount > 0,
          display: [
            `${getDisplayValueDecimal(curr.marketSales)}%`,
            `${getDisplayValueDecimal(curr.innovationSales)}%`
          ]
        }),
      []
    );
    const refactCategory = refactorCategoryTitles(data.categories);
    return createCatFirst(
      {
        chipIndex: 'chip' + 0,
        id: data.id,
        title: refactCategory.title,
        subtitle: data.levelShortName,
        value: [],
        hasHoverEffect: false,
        wrapLegendWithoutNumber: refactCategory.hasExtraSelection,
        legendTooltip: refactCategory.hintText,
        isClickable: false
      },
      sortArray(arr, 'title')
    );
  }
}

export function convertDataInnovationToMarket(data) {
  if (data && data.manufacturers) {
    const arr = data.manufacturers.reduce(
      (acc, curr, currIndex) =>
        acc.concat({
          chipIndex: 'chip' + (currIndex + 1),
          id: curr.id,
          title: Utils.convertInTitle(curr.name),
          subtitle: curr.levelShortName,
          value: [
            curr.innovationSales === 0 || curr.marketSales === 0
              ? 0
              : (curr.innovationSales / curr.marketSales - 1) * 100
          ],
          isClickable: curr.innovationItemCount > 0,
          display: [
            curr.innovationSales === 0 || curr.marketSales === 0
              ? 0
              : Math.round(curr.innovationSales / curr.marketSales * 100)
          ]
        }),
      []
    );
    const refactCategory = refactorCategoryTitles(data.categories);
    return checkAndUpdateScale(
      createCatFirst(
        {
          chipIndex: 'chip' + 0,
          id: data.id,
          title: refactCategory.title,
          subtitle: data.levelShortName,
          value: [],
          hasHoverEffect: false,
          wrapLegendWithoutNumber: refactCategory.hasExtraSelection,
          legendTooltip: refactCategory.hintText,
          isClickable: false,
          display: []
        },
        sortArray(arr, 'title')
      )
    );
  }
}

export function convertDataInnovationContributing(data) {
  if (data && data.manufacturers) {
    const maxValue = data.manufacturers
      .map(el => el.contribution)
      .reduce(maxCallback, data.contribution ? data.contribution : -Infinity);
    const arr = data.manufacturers.reduce(
      (acc, curr, currIndex) =>
        acc.concat({
          chipIndex: 'chip' + (currIndex + 1),
          id: curr.id,
          title: Utils.convertInTitle(curr.name),
          subtitle: curr.levelShortName,
          value: [[0], [0], [divideFunc(curr.contribution, maxValue) * 100]],
          isClickable: curr.innovationItemCount > 0,
          growthValue: [(curr.contribution - curr.prevContribution).toFixed(1)],
          display: [
            [
              (checkCurrencyWithFactType(data.factType)
                ? getCurrency(data.currency)
                : '') + `${numberWithCommas(curr.marketSalesTotal)}`
            ],
            [
              (checkCurrencyWithFactType(data.factType)
                ? getCurrency(data.currency)
                : '') + `${numberWithCommas(curr.innovationSalesTotal)}`
            ],
            [`${getDisplayValueDecimal(curr.contribution)}%`]
          ]
        }),
      []
    );
    const refactCategory = refactorCategoryTitles(data.categories);
    return createCatFirst(
      {
        chipIndex: 'chip' + 0,
        id: data.id,
        title: refactCategory.title,
        subtitle: data.levelShortName,
        value: [[0], [0], [divideFunc(data.contribution, maxValue) * 100]],
        isClickable: data.innovationItemCount > 0,
        wrapLegendWithoutNumber: refactCategory.hasExtraSelection,
        legendTooltip: refactCategory.hintText,
        growthValue: [getDisplayValueDecimal(data.contribution - data.prevContribution)],
        display: [
          [
            (checkCurrencyWithFactType(data.factType)
              ? getCurrency(data.currency)
              : '') + `${numberWithCommas(data.marketSalesTotal)}`
          ],
          [
            (checkCurrencyWithFactType(data.factType)
              ? getCurrency(data.currency)
              : '') + `${numberWithCommas(data.innovationSalesTotal)}`
          ],
          [`${getDisplayValueDecimal(data.contribution)}%`]
        ]
      },
      sortArray(arr, 'title')
    );
  }
}

export function convertDataColumnType(data, selector) {
  if (data && data.manufacturers) {
    const maxValue = data.manufacturers
      .map(el => el[selector].contribution)
      .reduce(
        maxCallback,
        data[selector].contribution ? data[selector].contribution : -Infinity
      );
    const arr = data.manufacturers.reduce(
      (acc, curr, currIndex) =>
        acc.concat({
          chipIndex: 'chip' + (currIndex + 1),
          id: curr.id,
          title: Utils.convertInTitle(curr.name),
          subtitle: curr.levelShortName,
          value: curr[selector].map(element => [element.contribution]),
          isClickable: curr.innovationItemCount > 0,
          display: curr[selector].map(element => [`${element.contribution}%`])
        }),
      []
    );
    const refactCategory = refactorCategoryTitles(data.categories);
    const result = createCatFirst(
      {
        chipIndex: 'chip' + 0,
        id: data.id,
        title: refactCategory.title,
        subtitle: data.levelShortName,
        value: data[selector].map(element => [element.contribution]),
        isClickable: data.innovationItemCount > 0,
        wrapLegendWithoutNumber: refactCategory.hasExtraSelection,
        legendTooltip: refactCategory.hintText,
        display: data[selector].map(element => [`${element.contribution}%`])
      },
      sortArray(arr, 'title')
    );
    return { result, columnArray: createColumnArray(data[selector]) };
  }
}

export function convertDataActivityIntensity(data) {
  if (data && data.manufacturers) {
    const maxValue = data.manufacturers
      .map(curr =>
        Math.max(
          curr.itemCount && data.itemCount
            ? curr.itemCount / data.itemCount * 100
            : 0,
          curr.innovationItemCount && data.innovationItemCount
            ? curr.innovationItemCount / data.innovationItemCount * 100
            : 0
        )
      )
      .reduce(maxCallback, -Infinity);
    const arr = data.manufacturers.reduce(
      (acc, curr, currIndex) =>
        acc.concat({
          chipIndex: 'chip' + (currIndex + 1),
          id: curr.id,
          title: Utils.convertInTitle(curr.name),
          subtitle: curr.levelShortName,
          value: [
            [0],
            [0],
            [
              curr.itemCount && data.itemCount
                ? curr.itemCount / data.itemCount * 100 / maxValue * 100
                : 0,
              curr.innovationItemCount && data.innovationItemCount
                ? curr.innovationItemCount /
                  data.innovationItemCount *
                  100 /
                  maxValue *
                  100
                : 0
            ]
          ],
          isClickable: curr.innovationItemCount > 0,
          display: [
            [`${numberWithCommas(curr.itemCount)}`],
            [`${numberWithCommas(curr.innovationItemCount)}`],
            [
              `${
                curr.itemCount && data.itemCount
                  ? getDisplayValueDecimal(
                      curr.itemCount / data.itemCount * 100
                    )
                  : 0
              }%`,
              `${
                data.innovationItemCount && curr.innovationItemCount
                  ? getDisplayValueDecimal(
                      curr.innovationItemCount / data.innovationItemCount * 100
                    )
                  : 0
              }%`
            ]
          ]
        }),
      []
    );
    const refactCategory = refactorCategoryTitles(data.categories);
    return createCatFirst(
      {
        chipIndex: 'chip' + 0,
        id: data.id,
        title: refactCategory.title,
        subtitle: data.levelShortName,
        value: [[0], [0], [0]],
        isClickable: data.innovationItemCount > 0,
        wrapLegendWithoutNumber: refactCategory.hasExtraSelection,
        legendTooltip: refactCategory.hintText,
        display: [
          [`${numberWithCommas(data.itemCount)}`],
          [`${numberWithCommas(data.innovationItemCount)}`],
          [``]
        ]
      },
      sortArray(arr, 'title')
    );
  }
}

export function convertDataItemPerformanceGap(data) {
  if (data && data.manufacturers) {
    const maxValue = data.manufacturers
      .map(
        curr =>
          curr.averageItemSale && curr.averageInnovationItemSale
            ? curr.averageInnovationItemSale / curr.averageItemSale * 100
            : 0
      )
      .reduce(
        maxCallback,
        data.averageItemSale && data.averageInnovationItemSale
          ? data.averageInnovationItemSale / data.averageItemSale * 100
          : -Infinity
      );
    const arr = data.manufacturers.reduce(
      (acc, curr, currIndex) =>
        acc.concat({
          chipIndex: 'chip' + (currIndex + 1),
          id: curr.id,
          title: Utils.convertInTitle(curr.name),
          subtitle: curr.levelShortName,
          value: [
            curr.averageItemSale && curr.averageInnovationItemSale
              ? curr.averageInnovationItemSale /
                curr.averageItemSale *
                100 /
                maxValue *
                100
              : 0
          ],
          isClickable: curr.innovationItemCount > 0,
          display: [
            `${
              curr.averageItemSale && curr.averageInnovationItemSale
                ? Math.round(
                    curr.averageInnovationItemSale / curr.averageItemSale * 100
                  )
                : 0
            }%`
          ]
        }),
      []
    );
    const refactCategory = refactorCategoryTitles(data.categories);
    return createCatFirst(
      {
        chipIndex: 'chip' + 0,
        id: data.id,
        title: Utils.convertInTitle(refactCategory.title),
        subtitle: data.levelShortName,
        value: [
          data.averageItemSale && data.averageInnovationItemSale
            ? data.averageInnovationItemSale /
              data.averageItemSale *
              100 /
              maxValue *
              100
            : 0
        ],
        isClickable: data.innovationItemCount > 0,
        wrapLegendWithoutNumber: refactCategory.hasExtraSelection,
        legendTooltip: refactCategory.hintText,
        display: [
          `${
            data.averageItemSale && data.averageInnovationItemSale
              ? Math.round(
                  data.averageInnovationItemSale / data.averageItemSale * 100
                )
              : 0
          }%`
        ]
      },
      sortArray(arr, 'title')
    );
  }
}

export function convertDataItemPerformanceAverageSale(data) {
  if (data && data.manufacturers) {
    let maxValue = Math.max(
      data.averageItemSale,
      data.averageInnovationItemSale
    );
    data.manufacturers.forEach(mfc => {
      const newMax = Math.max(
        mfc.averageItemSale,
        mfc.averageInnovationItemSale
      );
      maxValue = maxValue < newMax ? newMax : maxValue;
    });
    const arr = data.manufacturers.reduce(
      (acc, curr, currIndex) =>
        acc.concat({
          chipIndex: 'chip' + (currIndex + 1),
          id: curr.id,
          title: Utils.convertInTitle(curr.name),
          subtitle: curr.levelShortName,
          value: [
            curr.averageItemSale / maxValue * 100,
            curr.averageInnovationItemSale / maxValue * 100
          ],
          isClickable: curr.innovationItemCount > 0,
          display: [
            (checkCurrencyWithFactType(data.factType)
              ? getCurrency(data.currency)
              : '') +
              curr.averageItemSale
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            (checkCurrencyWithFactType(data.factType)
              ? getCurrency(data.currency)
              : '') +
              curr.averageInnovationItemSale
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          ]
        }),
      []
    );
    const refactCategory = refactorCategoryTitles(data.categories);
    return createCatFirst(
      {
        chipIndex: 'chip' + 0,
        id: data.id,
        title: refactCategory.title,
        subtitle: data.levelShortName,
        value: [
          data.averageItemSale / maxValue * 100,
          data.averageInnovationItemSale / maxValue * 100
        ],
        isClickable: data.innovationItemCount > 0,
        wrapLegendWithoutNumber: refactCategory.hasExtraSelection,
        legendTooltip: refactCategory.hintText,
        display: [
          (checkCurrencyWithFactType(data.factType)
            ? getCurrency(data.currency)
            : '') +
            data.averageItemSale
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          (checkCurrencyWithFactType(data.factType)
            ? getCurrency(data.currency)
            : '') +
            data.averageInnovationItemSale
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        ]
      },
      sortArray(arr, 'title')
    );
  }
}

export function convertDataInnovationCharacteristics(data) {
  if (data && data.characteristics) {
    let maxValue = 0;
    data.characteristics.forEach(mfc => {
      const newMax = Math.max(mfc.itemShare, mfc.innovationItemShare);
      maxValue = maxValue < newMax ? newMax : maxValue;
    });
    const arr = data.characteristics.reduce(
      (acc, curr, currIndex) =>
        acc.concat({
          chipIndex: 'chip' + currIndex,
          title: Utils.convertInTitle(`${currIndex + 1}. ${curr.value}`),
          subtitle: Utils.convertInTitle(`(${curr.name})`),
          id: curr.id,
          value: [
            [curr.itemShare / maxValue * 100],
            [curr.innovationItemShare / maxValue * 100]
          ],
          isClickable: true,
          legendTooltip: Utils.convertInTitle(
            `${currIndex + 1}. ${curr.value}\n(${curr.name})`
          ),
          wrapLegendWithHint: true,
          display: [[`${curr.itemShare}%`], [`${curr.innovationItemShare}%`]]
        }),
      []
    );
    const columnArray = [
      {
        name: 'Share of Total Items',
        shortName: 'Share of Total Items',
        subtitle: `(${numberWithCommas(data.itemCount)})`
      },
      {
        name: 'Share of Innovation Items',
        shortName: 'Share of Innovation Items',
        subtitle: `(${numberWithCommas(data.innovationItemCount)})`
      }
    ];
    return { data: arr, columnArray };
  }
}

export function convertDataItemPerformance(result) {
  const arr = result.manufacturers.reduce(
    (acc, curr, currIndex) =>
      acc.concat({
        chipIndex: 'chip' + (currIndex + 1),
        id: curr.id,
        title: curr.name,
        type: curr.levelShortName,
        subtitle: 'MFR / ' + curr.itemCount + ' items',
        itemCount: curr.itemCount,
        sales25: curr.sales25,
        sales75: curr.sales75,
        salesMedian: curr.salesMedian,
        value: [curr.sales75 - curr.sales25],
        isClickable: curr.itemCount > 0,
        display: [`${curr.salesMedian}`]
      }),
    []
  );
  const refactCategory = refactorCategoryTitles(result.categories);
  return createCatFirst(
    {
      chipIndex: 'chip' + 0,
      id: result.id,
      title: refactCategory.title,
      type: result.levelShortName,
      subtitle: 'CAT / ' + result.itemCount + ' items',
      itemCount: result.itemCount,
      sales25: result.sales25,
      sales75: result.sales75,
      salesMedian: result.salesMedian,
      value: [result.sales75 - result.sales25],
      isClickable: result.itemCount > 0,
      wrapLegendWithoutNumber: refactCategory.hasExtraSelection,
      legendTooltip: refactCategory.hintText,
      display: [`${result.salesMedian}`]
    },
    sortArray(arr, 'title')
  );
}

export function getIPDomainRange(
  data,
  minNoItem = 5,
  key1 = 'sales25',
  key2 = 'salesMedian',
  key3 = 'sales75',
  noOfItemKey = 'itemCount'
) {
  const min = parseInt(data[0][key1], 10);
  return data.reduce(
    (acc, obj) => {
      const noOfItem = parseInt(obj[noOfItemKey], 10);
      if (key1 && noOfItem > minNoItem) {
        acc[0] = obj[key1] < acc[0] ? obj[key1] : acc[0];
        acc[1] = obj[key1] > acc[1] ? obj[key1] : acc[1];
      }
      if (key2) {
        acc[0] = obj[key2] < acc[0] ? obj[key2] : acc[0];
        acc[1] = obj[key2] > acc[1] ? obj[key2] : acc[1];
      }
      if (key3 && noOfItem > minNoItem) {
        acc[0] = obj[key3] < acc[0] ? obj[key3] : acc[0];
        acc[1] = obj[key3] > acc[1] ? obj[key3] : acc[1];
      }
      return acc;
    },
    [min, 0]
  );
}

export function calculateScaleFactor(width, textWidth) {
  return (width - textWidth) / width;
}

export function getCurrency(currency) {
  return currency ? CURRENCY_SYMBOL[currency] || '' : '';
}
