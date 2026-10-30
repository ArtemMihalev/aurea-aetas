# Карты

AWMC geodata: https://github.com/AWMC/geodata, ODbL.

- Physical Data/open_water_awmc_work/openwater_base/open_water_base.shp → awmc-water.shp.
- Cultural-Data/political_shading/roman_empire_ce_117_extent/roman_empire_ce_117_extent.geojson → empire-117.geojson.
- Natural Earth ne_50m_rivers_lake_centerlines → отфильтрованный rivers.geojson (Дунай, Рейн, Евфрат, Тигр, Нил).

Производный SVG-путь воспроизводится командой node build-map.mjs. Физический слой инвертируется в маску суши, применяемую и к заливкам, и к областям конфликтов. Нет искусственного сглаживания берегов и исторической геометрии. Сглаживаются только авторские схематические области; их мягкая кромка обозначает неопределённость театра войны. Переключатели других периодов используют обобщённые исключения из контура 117 года; это поясняется на странице.
