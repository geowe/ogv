import './src/ui/MainTemplate';
import { SelectTool } from './src/ogv/tool/SelectTool';
import { UrlFileLoader } from './src/ogv/loader/UrlFileLoader';
import { AddLayerTool } from './src/ogv/tool/AddLayerTool';
import { MapSetting } from './src/ogv/map/MapSetting';
import { TitleMapTool } from './src/ogv/tool/TitleMapTool';
import { AddBasemapTool } from './src/ogv/tool/AddBasemapTool';
import { OverviewTool } from './src/ogv/tool/OverviewTool';
import { FullScreenTool } from './src/ogv/tool/FullScreenTool';

let mapSetting = new MapSetting();
let setting = mapSetting.getSetting();
new FullScreenTool(setting);
new AddBasemapTool(setting);
new OverviewTool(setting);
new TitleMapTool(setting);
new SelectTool(setting);
new AddLayerTool(mapSetting);
new UrlFileLoader(mapSetting).load();