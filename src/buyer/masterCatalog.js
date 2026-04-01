import normalizedDoormats from "./normalizedDoormats";
import normalizedPillowCovers from "./normalizedpillowCover";
import normalizedCurtains from "./normalizedCurtains";
import normalizedBedsheets from "./normalizedBedsheets";
import normalizedSofas from "./normalizedSofas";

const masterCatalog = [
  ...normalizedDoormats,
  ...normalizedPillowCovers,
  ...normalizedCurtains,
  ...normalizedBedsheets,
  ...normalizedSofas,
]
  .filter((item) => item && item.product_id)
  .map((item) => ({
    ...item,
    final_price:
      item.final_price ??
      item.price ??
      item.price_7ft ??
      item.price_9ft ??
      item.rate ??
      item.mrp ??
      item.MRP ??
      0,
  }));

export default masterCatalog;