import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  latLng,
  tileLayer,
  geoJSON,
  polygon,
  marker,
  Layer,
  icon,
  Icon,
  LeafletMouseEvent,
  IconOptions,
} from 'leaflet';
import { AreaService } from '../common/services/area.service';
import { Area } from '../common/models/Area';
import { PlaceService } from '../common/services/place.service';
import { Place } from '../common/models/Place';
import { MarkerService } from '../common/services/marker.service';
import { Marker } from '../common/models/Marker';
import { SystemDataService } from '../common/services/system-data.service';
import { SystemData } from '../common/models/SystemData';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { environment } from '../environments/environment';
import { Collapse, initTE } from 'tw-elements';
import { BushService } from '../common/services/bush.service';
import { Bush } from '../common/models/Bush';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  maxZoom: number = 18;
  title = 'eco_shymkent_front';
  areas: Area[] = [];
  places: Place[] = [];
  makers: Marker[] = [];
  bushes: Bush[] = [];
  Layer: any[] = [];
  //@ts-ignore
  SystemData: SystemData;
  //Interactive array
  activeAreas: number[] = [];
  activePlaces: number[] = [];
  searchPlaces: number[] = [];
  activeFilters: { [key: string]: number[] } = {
    event: [],
    status: [],
    category: [],
    sanitary: [],
    breed: [],
    type: [],
  };
  staticAreaInfo: {
    id: number;
    title: string;
    image_url: string;
    description: string;
    sub_desc: string;
    table: string | null;
  }[] = [
    {
      id: 7,
      title: 'Дендропарк',
      image_url: 'assets/images/dendro.jpg',
      description:
        '<p>&nbsp;&nbsp;&nbsp; Шымкент дендрологиялық саябағын&nbsp; құрудың тарихы 1979 жылдан бастау алады. Сол жылдары қала маңындағы&nbsp; қоқыс тастайтын аумақта белгілі қоғам және мемлекет қайраткері А. Асқаровтың басшылығымен дендросаябақ ұйымдастырылды.&nbsp; Дендросаябақтың жалпы&nbsp; жер көлемі 117,04 гектарды құрайды.</p><p>&nbsp;&nbsp;&nbsp; ОҚО әкімдігінің 2002 жылғы 28 маусымындағы №244 қаулысымен дендрологиялық саябаққа жергілікті маңызы бар ерекше қорғалатын табиғи аумақ мәртебесі берілген.</p><p>&nbsp;&nbsp;&nbsp; Шымкент қаласы мегаполис мәртебесіне алған соң, Шымкент қаласы әкімдігінің 2023 жылғы 31 шілдеде &ldquo;Шымкент қаласының жергілікті маңызы бар мемлекеттік табиғи-қорық қоры обьектілерінің тізбесін бекіту туралы&rdquo;&nbsp; 1875 қаулысына сәйкес, А.Асқаров атындағы Шымкент мемлекеттік дендрологиялық саябағына &ndash; жергілікті маңызы бар ерекше қорғалатын табиғи аумақ мәртебесі берілді.</p><p>&nbsp;&nbsp;&nbsp; Дендрологиялық саябақтың негізігі мақсаты - ағаш және бұта тұқымдарын қорғауға, молықтыру мен пайдалануға арналған аймақтар бойынша белгiленген күзет режимдерi бар табиғат қорғау және ғылыми ұйымдар мәртебесi бар ерекше қорғалатын табиғи аумақ жеріне жатады.</p><p>&nbsp;&nbsp;&nbsp; Дендросаябақтың негiзгi қызметiне Дүниежүзінің және Қазақстанның ағаш өсiмдiктерiн сақтаудың, молықтырудың және пайдаланудың ғылыми негiзiн әзiрлеу, Қазақстанның дүниежүзiлiк маңызы бар флорасының ресурстарын игеру жатады.</p><p>&nbsp;&nbsp;&nbsp; Қазіргі таңда, дендросаябақта 214 ағаш-бұталардың түрлері, 74,0 мыңнан астам&nbsp; ағаштар бар.</p>',
      sub_desc:
        '<p><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Ағымдағы жылы атқарылған жұмыстар</strong></p><ul><li>Дендросаябақ аумағыдағы өрттің алдын-алуға 10 дана өрт қалқаншалары, 10 дана рация және қауіпсіздік шаралары үшін алынды.</li><li>Саябақ аумағындағы ағаш-бұталардың аттарын жазуға және қауіпсіздік үшін 435 тақтайшалар қойылды.</li><li>Дендросаябақ аумағын көгалдандыру үшін 3000 түп раушангүлдері, 4000 түп петуния отырғызылды.</li><li>Ғылыми аймақта орналасқан жылыжай арнайы кленкамен жабдықталып, қыс мезгіліне дайындалды. Жылыжай аумағында 30 астам ағаш-бұталар: гинко, каркас, эводия, анар, лапина, хилокатальпа, барбарис, ленкоран альбициясы, қызыл арша және т.б түрлері өсірілуде.</li><li>Дендросаябақ аумағындағы жарықшамдар және кабельдерімен толығымен ауыстырылды</li><li>Дендросаябақ аумағында ағаш-бұталы екпелердің жай-күйін түгендеу және бағалау және топырақ құрамын анықтау масатында сараптама өткізілді. Сараптама қорытындысына сәйкес, жалпы ағаштар саны -74&nbsp;560 түп, бұталар саны- 4&nbsp;615 түп, ал ағаш-бұталардың гендік қоры 214 түр екендігі анықталды.&nbsp;</li><li>Дендросаябақ қызметкерлері жаздық және қыстық формамен толық қамтамасыз етілді.</li><li>Саябақ аумағындағы бос жатқан жерлерді көгалдандыру мақсатын Самал қақпасы аумағындағы 4 га жерге көктемде 1303 түп жеміс ағаштарының түрлері (шабдалы, өрік, алма, слива, жүзім және т.б) және 87 туя книжная&nbsp; қылқан жапырақты ағаштары егілді.</li><li>Күз мезгілінде 187 каштан, 100 сирень, 44 жыңғыл, 70 сумах отырғызылды.</li><li>Күз маусымында молайту жұмыстары үшін піскен 40 дан астам ағаш-бұта тұқымдары каштан, емен, долана, қызыл ағаш, птелея, сабын ағаш, сірке ағашы, үйеңкі, шаған, тау пісте, калина, айлант, пекан, липа, өрік, барбарис, гледичия, можжевельник, моңғол емені, кавказдық таудаған тұқымдары жиналып, тұқымбаққа себілді.</li><li>Саябақтың көл аумағындағы балық түрлерін көбейту үшін&nbsp; 200 кг 3 түрлі шабақтар жіберілді.</li><li>Демеушілер есебінен заманауи үлгідегі спорт алаңшасын жасалды.</li></ul>',
      table:
        '<p><strong>Дендросаябақ аумағындағы ағаш-бұта түрлері</strong></p><p><strong><em>( қылқан жапырақты-15, ағаштар-126, бұталар-73)</em></strong></p><table class=\'table-auto border\' border=\'1\' width="100%"><thead><tr><td colspan="5" width="100%"><p><strong>Қылқан жапырақтылар</strong></p></td></tr><tr><td width="8%"><p>1</p></td><td width="34%"><p>Биота восточная или Плосковеточник восточный</p></td><td colspan="2" width="29%"><p>Шығыстық биота</p></td><td width="27%"><p>Biot́a orientalis</p></td></tr><tr><td width="8%"><p>2</p></td><td width="34%"><p>Можжевельник скальный</p></td><td colspan="2" width="29%"><p>Жартасты арша</p></td><td width="27%"><p>Juniperusscopulorum</p></td></tr><tr><td width="8%"><p>3</p></td><td width="34%"><p>Ель сибирская</p></td><td colspan="2" width="29%"><p>Сібірлік шырша</p></td><td width="27%"><p>P&iacute;ceaobovata</p></td></tr><tr><td width="8%"><p>4</p></td><td width="34%"><p>Ель Тянь-Шанская</p></td><td colspan="2" width="29%"><p>Тянь-Шань шыршасы</p></td><td width="27%"><p>P&iacute;ceaSchrenki&aacute;na</p></td></tr><tr><td width="8%"><p>5</p></td><td width="34%"><p>Можжевельник зеравшанский</p></td><td colspan="2" width="29%"><p>Зеравшан аршасы</p></td><td width="27%"><p>Juniperusseravschanica</p></td></tr><tr><td width="8%"><p>6</p></td><td width="34%"><p>Можжевельник виргинский</p></td><td colspan="2" width="29%"><p>Виргиндік арша</p></td><td width="27%"><p>Juniperusvirginiana</p></td></tr><tr><td width="8%"><p>7</p></td><td width="34%"><p>Можжевельник обыкновенный</p></td><td colspan="2" width="29%"><p>Кәдімгі арша</p></td><td width="27%"><p>Jun&iacute;perus</p></td></tr><tr><td width="8%"><p>8</p></td><td width="34%"><p>Можжевельник казацкий</p></td><td colspan="2" width="29%"><p>Қызыл арша</p></td><td width="27%"><p>Juniṕerussab́ina</p></td></tr><tr><td width="8%"><p>9</p></td><td width="34%"><p>Ель голубая</p></td><td colspan="2" width="29%"><p>Тікенекті шырша</p></td><td width="27%"><p>Pīceapūngens</p></td></tr><tr><td width="8%"><p>10</p></td><td width="34%"><p>Сосна крымская</p></td><td colspan="2" width="29%"><p>Қырым қарағай</p></td><td width="27%"><p>P&iacute;nusn&iacute;grasubsp. pall&aacute;siana</p></td></tr><tr><td width="8%"><p>11</p></td><td width="34%"><p>Сосна обыкновенная</p></td><td colspan="2" width="29%"><p>Кәдімгі қарағай</p></td><td width="27%"><p>P&iacute;nussylvеstris</p></td></tr><tr><td width="8%"><p>12</p></td><td width="34%"><p>Сосна черная</p></td><td colspan="2" width="29%"><p>Қара қарағай</p></td><td width="27%"><p>Pinusnigra</p></td></tr><tr><td width="8%"><p>13</p></td><td width="34%"><p>Сосна эльдарская</p></td><td colspan="2" width="29%"><p>Елдар қарағайы</p></td><td width="27%"><p>Pinuseldarica</p></td></tr><tr><td width="8%"><p>14</p></td><td width="34%"><p>Туя восточная (книжная)</p></td><td colspan="2" width="29%"><p>Шығыстық биота</p></td><td width="27%"><p>Biot́aorientalis</p></td></tr><tr><td width="8%"><p>15</p></td><td width="34%"><p>Туя западная</p></td><td colspan="2" width="29%"><p>Батыстық туя</p></td><td width="27%"><p>Th&uacute;jaoccident&aacute;lis</p></td></tr><tr><td colspan="5" width="100%"><p><strong>Ағаштар</strong></p></td></tr></thead><tbody><tr><td width="8%"><p>16</p></td><td width="34%"><p>Акация белая</p></td><td colspan="2" width="29%"><p>Ақ акация</p></td><td width="27%"><p>Rob&iacute;nia pseudoacаcia</p></td></tr><tr><td width="8%"><p>17</p></td><td width="34%"><p>Абрикос маньчжурский</p></td><td colspan="2" width="29%"><p>Маньчжурлықөрік</p></td><td width="27%"><p>Pr&uacute;nusmandsch&uacute;rica</p></td></tr><tr><td width="8%"><p>18</p></td><td width="34%"><p>Абрикос обыкновенный</p></td><td colspan="2" width="29%"><p>Кәдімгіөрік</p></td><td width="27%"><p>Pr&uacute;nusvulgaris</p></td></tr><tr><td width="8%"><p>19</p></td><td width="34%"><p>Абрикос краснощекий</p></td><td colspan="2" width="29%"><p>Қызыл өрік</p></td><td width="27%"><p>Pr&uacute;nusarmen&iacute;aca</p></td></tr><tr><td width="8%"><p>20</p></td><td width="34%"><p>Айлант высочайший</p></td><td colspan="2" width="29%"><p>Биік айлант</p></td><td width="27%"><p>Ailаnthusalt&iacute;ssima</p></td></tr><tr><td width="8%"><p>21</p></td><td width="34%"><p>Акация шелковая</p></td><td colspan="2" width="29%"><p>Ленкора́н&nbsp; альби́циясы</p></td><td width="27%"><p>Albiziajulibrissin</p></td></tr><tr><td width="8%"><p>22</p></td><td width="34%"><p>Алыча. Слива растопыренная</p></td><td colspan="2" width="29%"><p>Алша алхорысы</p></td><td width="27%"><p>Pr&uacute;nusceras&iacute;fera</p></td></tr><tr><td width="8%"><p>23</p></td><td width="34%"><p>Багрянник канадский</p></td><td colspan="2" width="29%"><p>Канадалық қызыл ағаш</p></td><td width="27%"><p>Ceŕciscanadeńsis</p></td></tr><tr><td width="8%"><p>24</p></td><td width="34%"><p>Береза бумажная</p></td><td colspan="2" width="29%"><p>Қағазды қайың</p></td><td width="27%"><p>Betulapapyrifera</p></td></tr><tr><td width="8%"><p>25</p></td><td width="34%"><p>Береза повислая или барадавчатая</p></td><td colspan="2" width="29%"><p>Иілгішқайың</p></td><td width="27%"><p>Betulapendula</p></td></tr><tr><td width="8%"><p>26</p></td><td width="34%"><p>Береза повислая Юнги</p></td><td colspan="2" width="29%"><p>Юнги иілгішқайың</p></td><td width="27%"><p>Betulapendula&lsquo;Youngii&rsquo;</p></td></tr><tr><td width="8%"><p>27</p></td><td width="34%"><p>Боярышник алтайский</p></td><td colspan="2" width="29%"><p>Алтай доланасы</p></td><td width="27%"><p>CrataеgusTourn</p></td></tr><tr><td width="8%"><p>28</p></td><td width="34%"><p>Боярышник алматинский</p></td><td colspan="2" width="29%"><p>Алматы доланасы</p></td><td width="27%"><p>Crata&eacute;gusalmatinka</p></td></tr><tr><td width="8%"><p>29</p></td><td width="34%"><p>Боярышник кроваво-красный</p></td><td colspan="2" width="29%"><p>Алқызыл долана</p></td><td width="27%"><p>Crata&eacute;gussangu&iacute;nea</p></td></tr><tr><td width="8%"><p>30</p></td><td width="34%"><p>Боярышник круглолистный</p></td><td colspan="2" width="29%"><p>Дөңгелек жапырақты долана</p></td><td width="27%"><p>Crataegusrotundifolia</p></td></tr><tr><td width="8%"><p>31</p></td><td width="34%"><p>Боярышник обыкновенный</p></td><td colspan="2" width="29%"><p>Кәдімгі долана</p></td><td width="27%"><p>Crataeguslaevigata</p></td></tr><tr><td width="8%"><p>32</p></td><td width="34%"><p>Боярышник понтийский</p></td><td colspan="2" width="29%"><p>Понти доланасы</p></td><td width="27%"><p>Crataeguspontica</p></td></tr><tr><td width="8%"><p>33</p></td><td width="34%"><p>Боярышник туркестанский</p></td><td colspan="2" width="29%"><p>Түркістандық долана</p></td><td width="27%"><p>Crataegusturkestanica</p></td></tr><tr><td width="8%"><p>34</p></td><td width="34%"><p>Бруссонетия-бумажное дерево</p></td><td colspan="2" width="29%"><p>Қағаз ағашы</p></td><td width="27%"><p>Broussonetiapapyrifera</p></td></tr><tr><td width="8%"><p>35</p></td><td width="34%"><p>Бундук двудомный или кофейное дерево</p></td><td colspan="2" width="29%"><p>Бундук (Кофе ағашы)</p></td><td width="27%"><p>Gymnocladusdioicus</p></td></tr><tr><td width="8%"><p>36</p></td><td width="34%"><p>Аморфа кустарниковая</p></td><td colspan="2" width="29%"><p>Бұталы аморфа</p></td><td width="27%"><p>Am&oacute;rphafrutic&oacute;sa</p></td></tr><tr><td width="8%"><p>37</p></td><td width="34%"><p>Барбарис обыкновенный</p></td><td colspan="2" width="29%"><p>Қызыл бөріқарақат</p></td><td width="27%"><p>Berberis</p></td></tr><tr><td width="8%"><p>38</p></td><td width="34%"><p>Барбарис Тунберга</p></td><td colspan="2" width="29%"><p>Тунберга бөріқарақаты</p></td><td width="27%"><p>Berberisthunbergii</p></td></tr><tr><td width="8%"><p>39</p></td><td width="34%"><p>Барбарис круглоплодный</p></td><td colspan="2" width="29%"><p>Ірі жемісті бөріқарақат</p></td><td width="27%"><p><a href="https://ru.wikipedia.org/wiki/Berberis_oblonga">Berberisoblonga</a></p></td></tr><tr><td width="8%"><p>40</p></td><td width="34%"><p>Бересклет европейский</p></td><td colspan="2" width="29%"><p>Еуропалық қабыржық</p></td><td width="27%"><p>Euońymuseuropaeus</p></td></tr><tr><td width="8%"><p>41</p></td><td width="34%"><p>Бересклет обыкновенный</p></td><td colspan="2" width="29%"><p>Кәдімгі қабыржық</p></td><td width="27%"><p>Euońymus</p></td></tr><tr><td width="8%"><p>42</p></td><td width="34%"><p>Бересклет бородавчатый</p></td><td colspan="2" width="29%"><p>Қотыр қабыржық</p></td><td width="27%"><p>Euońymusverrucosus</p></td></tr><tr><td width="8%"><p>43</p></td><td width="34%"><p>Вяз мелколистный или приземестый</p></td><td colspan="2" width="29%"><p>Ұсақ жапырақты қарағаш</p></td><td width="27%"><p>Uĺmusparvifolia</p></td></tr><tr><td width="8%"><p>44</p></td><td width="34%"><p>Вяз обыкновенный</p></td><td colspan="2" width="29%"><p>Жылтыр шегіршін/ Кәдімгі шегіршін</p></td><td width="27%"><p>Uĺmuslaev́is</p></td></tr><tr><td width="8%"><p>45</p></td><td width="34%"><p>Вяз узколистный</p></td><td colspan="2" width="29%"><p>Жіңішке жапырақты қарағаш</p></td><td width="27%"><p>&Uacute;lmus angustifolia</p></td></tr><tr><td width="8%"><p>46</p></td><td width="34%"><p>Вяз малый</p></td><td colspan="2" width="29%"><p>Қарағаш малый</p></td><td width="27%"><p>Ulmus minor</p></td></tr><tr><td width="8%"><p>47</p></td><td width="34%"><p>Вяз граболистный</p></td><td colspan="2" width="29%"><p>Граб жапырақты шегіршін</p></td><td width="27%"><p>Ulmuscarpinifolia</p></td></tr><tr><td width="8%"><p>48</p></td><td width="34%"><p>Гинкго билоба</p></td><td colspan="2" width="29%"><p>Гинкго билоба</p></td><td width="27%"><p>Ginkgobilŏba</p></td></tr><tr><td width="8%"><p>49</p></td><td width="34%"><p>Гледичия одноколючковая или обыкновенная</p></td><td colspan="2" width="29%"><p>Кәдімгі қармала</p></td><td width="27%"><p>Gled&iacute;tsiatriacanthos</p></td></tr><tr><td width="8%"><p>50</p></td><td width="34%"><p>Гледичия трехколючковая</p></td><td colspan="2" width="29%"><p>Үш тікенді қармала</p></td><td width="27%"><p>Gled&iacute;tsiatriacanthos</p></td></tr><tr><td width="8%"><p>51</p></td><td width="34%"><p>Граб обыкновенный</p></td><td colspan="2" width="29%"><p>Кәдімгі граб</p></td><td width="27%"><p>Carpinusbetulus</p></td></tr><tr><td width="8%"><p>52</p></td><td width="34%"><p>Грецкий орех</p></td><td colspan="2" width="29%"><p>Грек жаңғағы</p></td><td width="27%"><p>Juǵlansreǵia</p></td></tr><tr><td width="8%"><p>53</p></td><td width="34%"><p>Гранат обыкновенный</p></td><td colspan="2" width="29%"><p>Анар ағашы</p></td><td width="27%"><p>P&uacute;nicagran&aacute;tum</p></td></tr><tr><td width="8%"><p>54</p></td><td width="34%"><p>Груша обыкновенная</p></td><td colspan="2" width="29%"><p>Кәдімгі алмұрт</p></td><td width="27%"><p>Pyŕus</p></td></tr><tr><td width="8%"><p>55</p></td><td width="34%"><p>Груша лесная</p></td><td colspan="2" width="29%"><p>Орман алмұрты</p></td><td width="27%"><p>Pyŕuscommuńis subsp. pyraśter</p></td></tr><tr><td width="8%"><p>56</p></td><td width="34%"><p>Дуб каштанолистный</p></td><td colspan="2" width="29%"><p>Талшын жапырақты емен</p></td><td width="27%"><p>Qu&eacute;rcuscastaneif&oacute;lia</p></td></tr><tr><td width="8%"><p>57</p></td><td width="34%"><p>Дуб монгольский</p></td><td colspan="2" width="29%"><p>Моңғол емені</p></td><td width="27%"><p>Queŕcusmongoĺica</p></td></tr><tr><td width="8%"><p>58</p></td><td width="34%"><p>Дуб пирамидальный</p></td><td colspan="2" width="29%"><p>Пирамидалық емен</p></td><td width="27%"><p>Quеŕcus</p></td></tr><tr><td width="8%"><p>59</p></td><td width="34%"><p>Дуб черешчатый</p></td><td colspan="2" width="29%"><p>Кәдімгі емен</p></td><td width="27%"><p>Quеŕcusrоb́ur</p></td></tr><tr><td width="8%"><p>60</p></td><td width="34%"><p>Дуб крупноплодный</p></td><td colspan="2" width="29%"><p>Ірі жемісті емен</p></td><td width="27%"><p>Quеŕcusmacrocarpa</p></td></tr><tr><td width="8%"><p>61</p></td><td width="34%"><p>Унаби</p></td><td colspan="2" width="29%"><p>Жылан жиде</p></td><td width="27%"><p>Ziziphusjujuba</p></td></tr><tr><td width="8%"><p>62</p></td><td width="34%"><p>Ива кайотова</p></td><td colspan="2" width="29%"><p>Кайотова талы</p></td><td width="27%"><p>Salixexigua</p></td></tr><tr><td width="8%"><p>63</p></td><td width="34%"><p>Ива белая, серебристая</p></td><td colspan="2" width="29%"><p>Ақ&nbsp; тал</p></td><td width="27%"><p>Sаĺixаĺba</p></td></tr><tr><td width="8%"><p>64</p></td><td width="34%"><p>Ива вавилонская(плакучая)</p></td><td colspan="2" width="29%"><p>Иілгіш/ Вавилондық тал</p></td><td width="27%"><p>Sаĺixbabylоńica</p></td></tr><tr><td width="8%"><p>65</p></td><td width="34%"><p>Ива древовидная, козья</p></td><td colspan="2" width="29%"><p>Ешкі тал</p></td><td width="27%"><p>Salix caprea</p></td></tr><tr><td width="8%"><p>66</p></td><td width="34%"><p>Ива спиральная, Мадцудана</p></td><td colspan="2" width="29%"><p>Матсуда талы</p></td><td width="27%"><p>Salixmatsudana</p></td></tr><tr><td width="8%"><p>67</p></td><td width="34%"><p>Ива узколистная</p></td><td colspan="2" width="29%"><p>Жіңішке жапырақты тал</p></td><td width="27%"><p>Ivaangustifolia</p></td></tr><tr><td width="8%"><p>68</p></td><td width="34%"><p>Каркас гладкий</p></td><td colspan="2" width="29%"><p>Жылтыртаудаған</p></td><td width="27%"><p>CeltislaevigataWilld</p><p>&nbsp;</p></td></tr><tr><td width="8%"><p>69</p></td><td width="34%"><p>Каркас китайский</p></td><td colspan="2" width="29%"><p>Қытай таудағаны</p></td><td width="27%"><p>Celtissinensis</p></td></tr><tr><td width="8%"><p>70</p></td><td width="34%"><p>Каркас кавказский</p></td><td colspan="2" width="29%"><p>Кавказ таудағаны</p></td><td width="27%"><p>C&eacute;ltiscauc&aacute;sica</p></td></tr><tr><td width="8%"><p>71</p></td><td width="34%"><p>Каркас западный</p></td><td colspan="2" width="29%"><p>Күнбатыс таудаған</p></td><td width="27%"><p>Celtisoccidentalis</p></td></tr><tr><td width="8%"><p>72</p></td><td width="34%"><p>Катальпа великолепная</p></td><td colspan="2" width="29%"><p>Көрікті Сәнағаш/ Әдемі сәнағаш</p></td><td width="27%"><p>Catalpaspeciosa</p></td></tr><tr><td width="8%"><p>73</p></td><td width="34%"><p>Катальпа обыкновенная</p></td><td colspan="2" width="29%"><p>Жолақгүлді сәнағаш</p></td><td width="27%"><p>Catalpabignonioides</p></td></tr><tr><td width="8%"><p>74</p></td><td width="34%"><p>Катальпа прекрасная</p></td><td colspan="2" width="29%"><p>Көрікті сәнағаш/Әдемі сәнағаш</p></td><td width="27%"><p>Catalpaspeciosa</p></td></tr><tr><td width="8%"><p>75</p></td><td width="34%"><p>Каштан конский</p></td><td colspan="2" width="29%"><p>Кәдімгі атбасталшын</p></td><td width="27%"><p>Aеśculushippocаśtanum</p></td></tr><tr><td width="8%"><p>76</p></td><td width="34%"><p>Кельрейтерия метельчатая, мыльное дерево</p></td><td colspan="2" width="29%"><p>Сабын ағашы</p></td><td width="27%"><p>Koelreuteri apaniculata</p></td></tr><tr><td width="8%"><p>77</p></td><td width="34%"><p>Клен американский или ясенелистный</p></td><td colspan="2" width="29%"><p>Шаған жапырақты үйеңкі</p></td><td width="27%"><p>Аćerneguńdo</p></td></tr><tr><td width="8%"><p>78</p></td><td width="34%"><p>Клен мелколистный</p></td><td colspan="2" width="29%"><p>Ұсақ жапырақты үйеңкі</p></td><td width="27%"><p>Acermono</p></td></tr><tr><td width="8%"><p>79</p></td><td width="34%"><p>Клен Семенова</p></td><td colspan="2" width="29%"><p>Семенова үйеңкісі</p></td><td width="27%"><p>Acer semenovii</p></td></tr><tr><td width="8%"><p>80</p></td><td width="34%"><p>Клен полевой</p></td><td colspan="2" width="29%"><p>Дала үйеңкі</p></td><td width="27%"><p>Аćercampеśtre</p></td></tr><tr><td width="8%"><p>81</p></td><td width="34%"><p>Клен приречный</p></td><td colspan="2" width="29%"><p>Өзендік үйеңкі</p></td><td width="27%"><p>Aćertataŕicum subsp. ginnala</p></td></tr><tr><td width="8%"><p>82</p></td><td width="34%"><p>Клен татарский</p></td><td colspan="2" width="29%"><p>Қара үйеңкі</p></td><td width="27%"><p>Аćertatаŕicum</p></td></tr><tr><td width="8%"><p>83</p></td><td width="34%"><p>Клен остролистный или платановидный</p></td><td colspan="2" width="29%"><p>Шынар жапырақты үйеңкі</p></td><td width="27%"><p>Acer platanoides</p></td></tr><tr><td width="8%"><p>84</p></td><td width="34%"><p>Клен трехраздельный</p></td><td colspan="2" width="29%"><p>Үш бөлікті үйеңкі</p></td><td width="27%"><p>Acer buergerianum</p></td></tr><tr><td width="8%"><p>85</p></td><td width="34%"><p>Клен трехлопастной</p></td><td colspan="2" width="29%"><p>Үш салалы үйеңкі</p></td><td width="27%"><p>Acer monspessulanum</p></td></tr><tr><td width="8%"><p>86</p></td><td width="34%"><p>Клен &laquo;KrimsonKing&raquo; красный</p></td><td colspan="2" width="29%"><p>&laquo;KrimsonKing&raquo; қызыл үйеңкісі</p></td><td width="27%"><p>Acer rubrum &lsquo;Crimson King&rsquo;</p></td></tr><tr><td width="8%"><p>87</p></td><td width="34%"><p>Клен узколистный</p></td><td colspan="2" width="29%"><p>Жіңішке жапырақты үйеңкі</p></td><td width="27%"><p>Аćerangustifolia</p></td></tr><tr><td width="8%"><p>88</p></td><td width="34%"><p>Клен ясенелистный</p></td><td colspan="2" width="29%"><p>Шаған жапырақты үйеңкі</p></td><td width="27%"><p>Аćerneguńdo</p></td></tr><tr><td width="8%"><p>89</p></td><td width="34%"><p>Клен американский&nbsp;</p></td><td colspan="2" width="29%"><p>Американдық&nbsp; үйеңкі</p></td><td width="27%"><p>Аćerneguńdo</p></td></tr><tr><td width="8%"><p>90</p></td><td width="34%"><p>Лапина крылоплодная</p></td><td colspan="2" width="29%"><p>Жемісті қанатты птерокария</p></td><td width="27%"><p>Pteroc&aacute;rya</p></td></tr><tr><td width="8%"><p>91</p></td><td width="34%"><p>Липа войлочная</p></td><td colspan="2" width="29%"><p>Күміс түсті жөке ағашы</p></td><td width="27%"><p>Tiliatomentosa</p></td></tr><tr><td width="8%"><p>92</p></td><td width="34%"><p>Липа мелколистная</p></td><td colspan="2" width="29%"><p>Ұсақ жапырақты жөке</p></td><td width="27%"><p>T&iacute;liacordаta</p></td></tr><tr><td width="8%"><p>93</p></td><td width="34%"><p>Липа крупнолистная</p></td><td colspan="2" width="29%"><p>Ірі жапырақты жөке ағашы</p></td><td width="27%"><p>T&iacute;liaplatyphуllos</p></td></tr><tr><td width="8%"><p>94</p></td><td width="34%"><p>Лох крупноплодный</p></td><td colspan="2" width="29%"><p>Ірі жемісті жиде</p></td><td width="27%"><p>Elaeagnusorientalis</p></td></tr><tr><td width="8%"><p>95</p></td><td width="34%"><p>Лох серебристый</p></td><td colspan="2" width="29%"><p>Күміс жиде</p></td><td width="27%"><p>Elaeagnuscommutata</p></td></tr><tr><td width="8%"><p>96</p></td><td width="34%"><p>Лох узколистный</p></td><td colspan="2" width="29%"><p>Жіңішке жапырақты жиде</p></td><td width="27%"><p>Elaeagnusangustifolia</p></td></tr><tr><td width="8%"><p>97</p></td><td width="34%"><p>Миндаль обыкновенный</p></td><td colspan="2" width="29%"><p>Кәдімгі бадам</p></td><td width="27%"><p>Prunusdulkis</p></td></tr><tr><td width="8%"><p>98</p></td><td width="34%"><p>Миндаль низкий</p></td><td colspan="2" width="29%"><p>Аласа бадам</p></td><td width="27%"><p>Prunustenella</p></td></tr><tr><td width="8%"><p>99</p></td><td width="34%"><p>Орех маньчжурский</p></td><td colspan="2" width="29%"><p>Манчжурлык жаңғақ</p></td><td width="27%"><p>Juglansmandshurica</p></td></tr><tr><td width="8%"><p>100</p></td><td width="34%"><p>Орех черный</p></td><td colspan="2" width="29%"><p>Қара жаңғақ</p></td><td width="27%"><p>Juglansnigra</p></td></tr><tr><td width="8%"><p>101</p></td><td width="34%"><p>Орех большой</p></td><td colspan="2" width="29%"><p>Дәу жаңғақ</p></td><td width="27%"><p>Juglansmajor</p></td></tr><tr><td width="8%"><p>102</p></td><td width="34%"><p>Павлония войлочная</p></td><td colspan="2" width="29%"><p>Павлония</p></td><td width="27%"><p>Paul&oacute;wniatoment&oacute;sa</p></td></tr><tr><td width="8%"><p>103</p></td><td width="34%"><p>Пекан обыкновенный</p></td><td colspan="2" width="29%"><p>Кәдімгі пекан</p></td><td width="27%"><p>Caŕyaillinoineńsis</p></td></tr><tr><td width="8%"><p>104</p></td><td width="34%"><p>Платан восточный</p></td><td colspan="2" width="29%"><p>Шығыс шынары</p></td><td width="27%"><p>Plаt́anusorientalis</p></td></tr><tr><td width="8%"><p>105</p></td><td width="34%"><p>Платан западный</p></td><td colspan="2" width="29%"><p>Батыс шынары</p></td><td width="27%"><p>Platanusoccidentalis</p></td></tr><tr><td width="8%"><p>106</p></td><td width="34%"><p>Птелея трехлистная</p></td><td colspan="2" width="29%"><p>Үш жапырақты птелея</p></td><td width="27%"><p>Рteĺeatrifoliat́a</p></td></tr><tr><td width="8%"><p>107</p></td><td width="34%"><p>Слива домашняя</p></td><td colspan="2" width="29%"><p>Үй өрігі</p></td><td width="27%"><p>Pr&uacute;nus</p></td></tr><tr><td width="8%"><p>108</p></td><td width="34%"><p>Слива Писсарда</p></td><td colspan="2" width="29%"><p>Писсардақараөрігі</p></td><td width="27%"><p>Pr&uacute;nusPissard</p></td></tr><tr><td width="8%"><p>109</p></td><td width="34%"><p>Слива черная</p></td><td colspan="2" width="29%"><p>Қараөрік</p></td><td width="27%"><p>Pr&uacute;nusnigra</p></td></tr><tr><td width="8%"><p>110</p></td><td width="34%"><p>Смородина черная</p></td><td colspan="2" width="29%"><p>Алтын қарақат</p></td><td width="27%"><p>Ribesaureum</p></td></tr><tr><td width="8%"><p>111</p></td><td width="34%"><p>Софора японская</p></td><td colspan="2" width="29%"><p>Жапондық софора</p></td><td width="27%"><p>Styphnol&oacute;biumjap&oacute;nicum</p></td></tr><tr><td width="8%"><p>112</p></td><td width="34%"><p>Тюльпанное дерево</p></td><td colspan="2" width="29%"><p>Қызғалдақ ағашы</p></td><td width="27%"><p>Liriodendron</p></td></tr><tr><td width="8%"><p>113</p></td><td width="34%"><p>Терн. Слива колючая</p></td><td colspan="2" width="29%"><p>Шомырт</p></td><td width="27%"><p>Pr&uacute;nusspin&oacute;sa</p></td></tr><tr><td width="8%"><p>114</p></td><td width="34%"><p>Тополь белый или серебристый</p></td><td colspan="2" width="29%"><p>Ақ терек</p></td><td width="27%"><p>Pоṕulusаĺba</p></td></tr><tr><td width="8%"><p>115</p></td><td width="34%"><p>Тополь болле</p></td><td colspan="2" width="29%"><p>Болле терегі</p></td><td width="27%"><p>Pоṕulusbolleana</p></td></tr><tr><td width="8%"><p>116</p></td><td width="34%"><p>Тополь красный</p></td><td colspan="2" width="29%"><p>Қызыл терек</p></td><td width="27%"><p>P&oacute;pulusruber</p></td></tr><tr><td width="8%"><p>117</p></td><td width="34%"><p>Тополь пирамидальный</p></td><td colspan="2" width="29%"><p>Пирамида тәрізді терек</p></td><td width="27%"><p>Poṕuluspyramidaĺis</p></td></tr><tr><td width="8%"><p>118</p></td><td width="34%"><p>Тополь черный</p></td><td colspan="2" width="29%"><p>Қара терек</p></td><td width="27%"><p>P&oacute;pulusn&iacute;gra</p></td></tr><tr><td width="8%"><p>119</p></td><td width="34%"><p>Туранга разнолистная</p></td><td colspan="2" width="29%"><p>Түрлі жапырақты тораңғыл</p></td><td width="27%"><p>Populusdiversifolia</p></td></tr><tr><td width="8%"><p>120</p></td><td width="34%"><p>Хилокатальпа ташкентская</p></td><td colspan="2" width="29%"><p>Ташкенттік&nbsp; Хилокатальпа</p></td><td width="27%"><p>Chitalpatashkentensis</p></td></tr><tr><td width="8%"><p>121</p></td><td width="34%"><p>Черемуха маголебка</p></td><td colspan="2" width="29%"><p>Магалебка мойылы</p></td><td width="27%"><p>Padusmaholeb</p></td></tr><tr><td width="8%"><p>122</p></td><td width="34%"><p>Черемуха обыкновенная</p></td><td colspan="2" width="29%"><p>Кәдімгі мойыл</p></td><td width="27%"><p>Padusracemosa</p></td></tr><tr><td width="8%"><p>123</p></td><td width="34%"><p>Черемуха черная</p></td><td colspan="2" width="29%"><p>Ірі жемісті қара шие</p></td><td width="27%"><p>Pr&uacute;nusp&aacute;dus</p></td></tr><tr><td width="8%"><p>124</p></td><td width="34%"><p>Черешня, вишня птичья</p></td><td colspan="2" width="29%"><p>Құс шиесі</p></td><td width="27%"><p>Pr&uacute;nus&aacute;viumruber</p></td></tr><tr><td width="8%"><p>125</p></td><td width="34%"><p>Черешня желтая</p></td><td colspan="2" width="29%"><p>Сары шиесі</p></td><td width="27%"><p>Pr&uacute;nus&aacute;viumflavus</p></td></tr><tr><td width="8%"><p>126</p></td><td width="34%"><p>Шелковица белая</p></td><td colspan="2" width="29%"><p>Ақ тұт</p></td><td width="27%"><p>Mоrusаlba</p></td></tr><tr><td width="8%"><p>127</p></td><td width="34%"><p>Шелковица черная</p></td><td colspan="2" width="29%"><p>Қара тұт</p></td><td width="27%"><p>M&oacute;rusn&iacute;gra</p></td></tr><tr><td width="8%"><p>128</p></td><td width="34%"><p>Эводия хубейская</p></td><td colspan="2" width="29%"><p>Хубейлік эводия</p></td><td width="27%"><p>Evodia hupehensis</p></td></tr><tr><td width="8%"><p>129</p></td><td width="34%"><p>Яблоня декоративная &laquo;Ред обелиск&raquo;</p></td><td colspan="2" width="29%"><p>Сәндік алма ағашы&nbsp; &laquo;Ред Обелиск&raquo;</p></td><td width="27%"><p>Mаlus &laquo;Red Obelisk&raquo;</p></td></tr><tr><td width="8%"><p>130</p></td><td width="34%"><p>Яблоня домашняя</p></td><td colspan="2" width="29%"><p>Үй алмасы</p></td><td width="27%"><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Malusdomestica</p></td></tr><tr><td width="8%"><p>131</p></td><td width="34%"><p>Яблоня колоновидная</p></td><td colspan="2" width="29%"><p>Бағаналы алма ағашы</p></td><td width="27%"><p>Malus Medoc</p></td></tr><tr><td width="8%"><p>132</p></td><td width="34%"><p>Яблоня лесная</p></td><td colspan="2" width="29%"><p>Жабайы алма/ Орман алма ағашы</p></td><td width="27%"><p>Mаlus sylv&eacute;stris</p></td></tr><tr><td width="8%"><p>133</p></td><td width="34%"><p>Яблоня лимонка</p></td><td colspan="2" width="29%"><p>Лимон алма ағашы</p></td><td width="27%"><p>Maluscitrea</p></td></tr><tr><td width="8%"><p>134</p></td><td width="34%"><p>Яблоня мелкоплодная</p></td><td colspan="2" width="29%"><p>Ұсақ жемісті алма</p></td><td width="27%"><p>Malusprunifolia</p></td></tr><tr><td width="8%"><p>135</p></td><td width="34%"><p>Яблоня обильноцветущая</p></td><td colspan="2" width="29%"><p>Мол гүлдейтін алма</p></td><td width="27%"><p>Malus floribunda</p></td></tr><tr><td width="8%"><p>136</p></td><td width="34%"><p>Яблоня Симиренко</p></td><td colspan="2" width="29%"><p>Симиренко алма ағашы</p></td><td width="27%"><p>Malussimirenko</p></td></tr><tr><td width="8%"><p>137</p></td><td width="34%"><p>Ясень зеленый, ланцетный</p></td><td colspan="2" width="29%"><p>Жасыл шаған</p></td><td width="27%"><p>Fraxinuslanceolata</p></td></tr><tr><td width="8%"><p>138</p></td><td width="34%"><p>Ясень обыкновенный</p></td><td colspan="2" width="29%"><p>Кәдімгі шаған</p></td><td width="27%"><p>Fraxinus excelsior</p></td></tr><tr><td width="8%"><p>139</p></td><td width="34%"><p>Ясень пенсильванский</p></td><td colspan="2" width="29%"><p>Пенсильван шағаны</p></td><td width="27%"><p>Frаx́inuspennsylvаńica</p></td></tr><tr><td width="8%"><p>140</p></td><td width="34%"><p>Ясень узколистный</p></td><td colspan="2" width="29%"><p>Жіңішке жапырақты шаған</p></td><td width="27%"><p>Frax́inusangustifoĺia</p></td></tr><tr><td width="8%"><p>141</p></td><td width="34%"><p>Ясень черный</p></td><td colspan="2" width="29%"><p>Қара шаған</p></td><td width="27%"><p>Fraxinusnigra</p></td></tr><tr><td colspan="5" width="100%"><p><strong>Бұталар</strong></p></td></tr><tr><td width="8%"><p>142</p></td><td width="34%"><p>Вейгела цветущая &laquo;RedPrince&raquo;</p></td><td width="28%"><p>Гүлдейтін вейгела &laquo;RedPrince&raquo;</p></td><td colspan="2" width="29%"><p>Weigelaflorida &lsquo;Red Prince&rsquo;</p></td></tr><tr><td width="8%"><p>143</p></td><td width="34%"><p>Вейгела красная</p></td><td width="28%"><p>Қызыл вейгела</p></td><td colspan="2" width="29%"><p>WeigelaPupuria red</p></td></tr><tr><td width="8%"><p>144</p></td><td width="34%"><p>Виноград домашний, культурный</p></td><td width="28%"><p>Үй, екпе жүзімі</p></td><td colspan="2" width="29%"><p>V&iacute;tisvinifera</p></td></tr><tr><td width="8%"><p>145</p></td><td width="34%"><p>Виноград девичий</p></td><td width="28%"><p>Жүзім</p></td><td colspan="2" width="29%"><p>V&iacute;tis</p></td></tr><tr><td width="8%"><p>146</p></td><td width="34%"><p>Виноград амурский</p></td><td width="28%"><p>Амур жүзімі</p></td><td colspan="2" width="29%"><p>V&iacute;tisamur&eacute;nsis</p></td></tr><tr><td width="8%"><p>147</p></td><td width="34%"><p>Виноград красный</p></td><td width="28%"><p>Қызғылт жүзім</p></td><td colspan="2" width="29%"><p>Parthenocissusquinquefolia</p></td></tr><tr><td width="8%"><p>148</p></td><td width="34%"><p>Витекс священный</p></td><td width="28%"><p>Зәмбіл ағаш</p></td><td colspan="2" width="29%"><p>V&iacute;tex &aacute;gnus-c&aacute;stus</p></td></tr><tr><td width="8%"><p>149</p></td><td width="34%"><p>Вишня красноплодная</p></td><td width="28%"><p>Қызыл жемісті шие</p></td><td colspan="2" width="29%"><p>Cerasuserythrocarpa</p></td></tr><tr><td width="8%"><p>150</p></td><td width="34%"><p>Вишня войлочная</p></td><td width="28%"><p>Түкті шие</p></td><td colspan="2" width="29%"><p>Pruńustomentosa</p></td></tr><tr><td width="8%"><p>151</p></td><td width="34%"><p>Буддлея Давида</p></td><td width="28%"><p>Давид буддлеясы</p></td><td colspan="2" width="29%"><p>Buddl&eacute;jadav&iacute;dii</p></td></tr><tr><td width="8%"><p>152</p></td><td width="34%"><p>Бузина Ева</p></td><td width="28%"><p>Қара аюбадам &laquo;Ева&raquo;</p></td><td colspan="2" width="29%"><p>SambućusEva</p></td></tr><tr><td width="8%"><p>153</p></td><td width="34%"><p>Бузина черная</p></td><td width="28%"><p>Қара ақбадам</p></td><td colspan="2" width="29%"><p>Sambućusnigra</p></td></tr><tr><td width="8%"><p>154</p></td><td width="34%"><p>Бирючина обыкновенная</p></td><td width="28%"><p>Кәдімгі лигуструм</p></td><td colspan="2" width="29%"><p>Ligustrumvulgare</p></td></tr><tr><td width="8%"><p>155</p></td><td width="34%"><p>Бирючина Ибота</p></td><td width="28%"><p>Ибота лигуструмы</p></td><td colspan="2" width="29%"><p>Ligustrumibota</p></td></tr><tr><td width="8%"><p>156</p></td><td width="34%"><p>Бирючина китайская</p></td><td width="28%"><p>Қытай лигуструмы</p></td><td colspan="2" width="29%"><p>Ligustrumsinense</p></td></tr><tr><td width="8%"><p>157</p></td><td width="34%"><p>Бирючина овальнолистная</p></td><td width="28%"><p>Сопақ жапырақты лигуструм</p></td><td colspan="2" width="29%"><p>Ligustrumovalifolium</p></td></tr><tr><td width="8%"><p>158</p></td><td width="34%"><p>Гибискус болотный</p></td><td width="28%"><p>Батпақты бөрітарақ</p></td><td colspan="2" width="29%"><p>Hibiscus</p></td></tr><tr><td width="8%"><p>159</p></td><td width="34%"><p>Гибискус сирийский</p></td><td width="28%"><p>Сириялықбөріқарақат</p></td><td colspan="2" width="29%"><p>Hib&iacute;scussyr&iacute;acus</p></td></tr><tr><td width="8%"><p>160</p></td><td width="34%"><p>Дейция амурская (мелкоцветковая)</p></td><td width="28%"><p>Ұсақ жапырақты дейция</p></td><td colspan="2" width="29%"><p>Deutziaamurensis</p></td></tr><tr><td width="8%"><p>161</p></td><td width="34%"><p>Виноград девичий плющевидный</p></td><td width="28%"><p>Шырмауық тектес жүзім</p></td><td colspan="2" width="29%"><p>Parthenocissus tricuspidata</p></td></tr><tr><td width="8%"><p>162</p></td><td width="34%"><p>Дерен красный</p></td><td width="28%"><p>Алқызыл свида</p></td><td colspan="2" width="29%"><p>Coŕnussanguinea</p></td></tr><tr><td width="8%"><p>163</p></td><td width="34%"><p>Дереза русская</p></td><td width="28%"><p>Орыс тікен бұтасы</p></td><td colspan="2" width="29%"><p>Lyciumruthenicum</p></td></tr><tr><td width="8%"><p>164</p></td><td width="34%"><p>Айва обыкновенная</p></td><td width="28%"><p>Кәдімгі айва</p></td><td colspan="2" width="29%"><p>Cydōnia</p></td></tr><tr><td width="8%"><p>165</p></td><td width="34%"><p>Айва японская</p></td><td width="28%"><p>Жапондық айва</p></td><td colspan="2" width="29%"><p>Chaenom&eacute;lesjap&oacute;nica</p></td></tr><tr><td width="8%"><p>166</p></td><td width="34%"><p>Жимолость низкая</p></td><td width="28%"><p>Кәдімгіұшқат</p></td><td colspan="2" width="29%"><p>Loniceraxylosteum</p></td></tr><tr><td width="8%"><p>167</p></td><td width="34%"><p>Жимолость обыкновенная</p></td><td width="28%"><p>Кәдімгі ұшқат</p></td><td colspan="2" width="29%"><p>Loniceraxylosteum</p></td></tr><tr><td width="8%"><p>168</p></td><td width="34%"><p>Жимолость Маака</p></td><td width="28%"><p>Маак ұшқат</p></td><td colspan="2" width="29%"><p>Loniceramaackii</p></td></tr><tr><td width="8%"><p>169</p></td><td width="34%"><p>Жимолость татарская</p></td><td width="28%"><p>Татар ұшқат</p></td><td colspan="2" width="29%"><p>Loniceratataŕica</p></td></tr><tr><td width="8%"><p>170</p></td><td width="34%"><p>Жимолость двудомная или мелкоцветковая</p></td><td width="28%"><p>Ұсақ гүлді ұшқат</p></td><td colspan="2" width="29%"><p>Loniceradioica</p></td></tr><tr><td width="8%"><p>171</p></td><td width="34%"><p>Жостер слабительный</p></td><td width="28%"><p>Ішдәрі қаражеміс</p></td><td colspan="2" width="29%"><p>Rhаḿnuscathаŕtica</p></td></tr><tr><td width="8%"><p>172</p></td><td width="34%"><p>Инжир обыкновенный</p></td><td width="28%"><p>Кәдімгі инжир</p></td><td colspan="2" width="29%"><p>F&iacute;cusc&aacute;rica</p></td></tr><tr><td width="8%"><p>173</p></td><td width="34%"><p>Ирга овальнолистная</p></td><td width="28%"><p>Сопақ жапырақты ирга</p></td><td colspan="2" width="29%"><p>Amelanchierovalis</p></td></tr><tr><td width="8%"><p>174</p></td><td width="34%"><p>Калина гордовина</p></td><td width="28%"><p>Кәдімгі шәңкiш, бүрген</p></td><td colspan="2" width="29%"><p>Vib&uacute;rnumlant&aacute;na</p></td></tr><tr><td width="8%"><p>175</p></td><td width="34%"><p>Кизильник черноплодный</p></td><td width="28%"><p>Қара жемісті қара ырғай</p></td><td colspan="2" width="29%"><p>Cotoneaster melanocarpus</p></td></tr><tr><td width="8%"><p>176</p></td><td width="34%"><p>Кизильник блестящий</p></td><td width="28%"><p>Жылтыр қызыл бұта</p></td><td colspan="2" width="29%"><p>Cotoneaster lucidus</p></td></tr><tr><td width="8%"><p>177</p></td><td width="34%"><p>Лаврови́шня лекарственная</p></td><td width="28%"><p>Дәрілік лаврошие</p></td><td colspan="2" width="29%"><p>Pr&uacute;nuslauroc&eacute;rasus</p></td></tr><tr><td width="8%"><p>178</p></td><td width="34%"><p>Лапчатка желтая</p></td><td width="28%"><p>Сары түсті Лапчатка</p></td><td colspan="2" width="29%"><p>Potentillaerecta</p></td></tr><tr><td width="8%"><p>179</p></td><td width="34%"><p>Лапчатка кустарниковая Абботствуд</p></td><td width="28%"><p>Бұталы лапчатка Абботсвуд</p></td><td colspan="2" width="29%"><p>Potentillafruticosa &lsquo;Abbotswood&rsquo;</p></td></tr><tr><td width="8%"><p>180</p></td><td width="34%"><p>Лапчатка кустарниковая Ред Айс</p></td><td width="28%"><p>Бұталы лапчатка Ред Айс</p></td><td colspan="2" width="29%"><p>Potentillafruticosa &lsquo;Red Ace&rsquo;</p></td></tr><tr><td width="8%"><p>181</p></td><td width="34%"><p>Магнолия суланжа</p></td><td width="28%"><p>Суланж магнолиясы</p></td><td colspan="2" width="29%"><p>Magnolia soulangeana</p></td></tr><tr><td width="8%"><p>182</p></td><td width="34%"><p>Магония подуболистная</p></td><td width="28%"><p>Үшкір жапырақты падуб/Падуб магониясы</p></td><td colspan="2" width="29%"><p>Mahōniaaquifōlium</p></td></tr><tr><td width="8%"><p>183</p></td><td width="34%"><p>Мелия ацедарах</p></td><td width="28%"><p>Мелия ацедарах</p></td><td colspan="2" width="29%"><p>Melia azedarach</p></td></tr><tr><td width="8%"><p>184</p></td><td width="34%"><p>Олеандр обыкновенный</p></td><td width="28%"><p>Талгүл</p></td><td colspan="2" width="29%"><p>Nerium oleander</p></td></tr><tr><td width="8%"><p>185</p></td><td width="34%"><p>Персик обыкновенный</p></td><td width="28%"><p>Кәдімгі шабдалы</p></td><td colspan="2" width="29%"><p>Pr&uacute;nusp&eacute;rsica</p></td></tr><tr><td width="8%"><p>186</p></td><td width="34%"><p>Персик голоплодный (нектарин)</p></td><td width="28%"><p>Шабдалы Нектарин</p></td><td colspan="2" width="29%"><p>Prunuspersica&nbsp;<a href="https://ru.wikipedia.org/wiki/Var.">var.</a>&nbsp;nucipersica</p></td></tr><tr><td width="8%"><p>187</p></td><td width="34%"><p>Пираканта ярко-красная</p></td><td width="28%"><p>Ашық қызыл пираканта</p></td><td colspan="2" width="29%"><p>Ryracantharubeus</p></td></tr><tr><td width="8%"><p>188</p></td><td width="34%"><p>Пираканта ярко-оранжевая</p></td><td width="28%"><p>Ашық қызылсары пираканта</p></td><td colspan="2" width="29%"><p>Ryracanthaaurantiacaclara</p></td></tr><tr><td width="8%"><p>189</p></td><td width="34%"><p>Пузыреплодник калинолистный</p></td><td width="28%"><p>&nbsp;Қызыл жапырақты көпіршік&nbsp; жемісі</p></td><td colspan="2" width="29%"><p>Physocarpusopulifolius</p></td></tr><tr><td width="8%"><p>190</p></td><td width="34%"><p>Рута душистая</p></td><td width="28%"><p>Рута</p></td><td colspan="2" width="29%"><p>R&uacute;ta grave&oacute;lens</p></td></tr><tr><td width="8%"><p>191</p></td><td width="34%"><p>Секуренега полукустарниковая</p></td><td width="28%"><p>Жартылай бұталы секуренега</p></td><td colspan="2" width="29%"><p>Securinega suffruticosa</p></td></tr><tr><td width="8%"><p>192</p></td><td width="34%"><p>Свидина белая</p></td><td width="28%"><p>Ақ свида</p></td><td colspan="2" width="29%"><p>Cornus alba</p></td></tr><tr><td width="8%"><p>193</p></td><td width="34%"><p>Самшит вечнозеленый</p></td><td width="28%"><p>Мәңгі жасыл самшит</p></td><td colspan="2" width="29%"><p>B&uacute;xussemperv&iacute;rens</p></td></tr><tr><td width="8%"><p>194</p></td><td width="34%"><p>Скумпия кожевенная Royal Purple</p></td><td width="28%"><p>Скумпия былғары Royal Purple</p></td><td colspan="2" width="29%"><p>Cot́inuscoggygria Royal Purple</p></td></tr><tr><td width="8%"><p>195</p></td><td width="34%"><p>Скумпия обыкновенная</p></td><td width="28%"><p>Кәдімгі скумпия</p></td><td colspan="2" width="29%"><p>Cot́inus</p></td></tr><tr><td width="8%"><p>196</p></td><td width="34%"><p>Сирень венгерская</p></td><td width="28%"><p>Мажар жұпаргүлі</p></td><td colspan="2" width="29%"><p>Syringajosikaea</p></td></tr><tr><td width="8%"><p>197</p></td><td width="34%"><p>Сирень индийская</p></td><td width="28%"><p>Үнді жұпаргүлі</p></td><td colspan="2" width="29%"><p>Syringaindica</p></td></tr><tr><td width="8%"><p>198</p></td><td width="34%"><p>Сирень обыкновенная</p></td><td width="28%"><p>Кәдімгі жұпаргүл</p></td><td colspan="2" width="29%"><p>Syr&iacute;ngavulg&aacute;ris</p></td></tr><tr><td width="8%"><p>199</p></td><td width="34%"><p>Спирея иволистная</p></td><td width="28%"><p>Тал жапыракты тобылғы</p></td><td colspan="2" width="29%"><p>Spiraeasalicifolia</p></td></tr><tr><td width="8%"><p>200</p></td><td width="34%"><p>Спирея японская &laquo;Антони Ватерер&raquo;</p></td><td width="28%"><p>Жапондык тобылғы &laquo;Антони Ватерер&raquo;</p></td><td colspan="2" width="29%"><p>Spiraea japonica &laquo;Anthony Waterer&raquo;</p></td></tr><tr><td width="8%"><p>201</p></td><td width="34%"><p>Снежноягодник белый</p></td><td width="28%"><p>Ақ қаржидек</p></td><td colspan="2" width="29%"><p>Symphoricarposalbus</p></td></tr><tr><td width="8%"><p>202</p></td><td width="34%"><p>Снежноягодник розовый</p></td><td width="28%"><p>Қызғылт қаржидек</p></td><td colspan="2" width="29%"><p>Symphoricarposrosea</p></td></tr><tr><td width="8%"><p>203</p></td><td width="34%"><p>Сумах пушистый, уксусное дерево</p></td><td width="28%"><p>Сірке ағашы</p></td><td colspan="2" width="29%"><p>Rhuscoriaria</p></td></tr><tr><td width="8%"><p>204</p></td><td width="34%"><p>Тамарикс</p></td><td width="28%"><p>Жыңғылы</p></td><td colspan="2" width="29%"><p>Tamarix</p></td></tr><tr><td width="8%"><p>205</p></td><td width="34%"><p>Шиповник майский</p></td><td width="28%"><p>Май итмұрын</p></td><td colspan="2" width="29%"><p>Rosa majalis</p></td></tr><tr><td width="8%"><p>206</p></td><td width="34%"><p>Шиповник обыкновенный</p></td><td width="28%"><p>Кәдімгі итмұрын</p></td><td colspan="2" width="29%"><p>R&oacute;sacinnamomea</p></td></tr><tr><td width="8%"><p>207</p></td><td width="34%"><p>Форзиция желтая</p></td><td width="28%"><p>Сары форзиция</p></td><td colspan="2" width="29%"><p>Forsythiaflavus</p></td></tr><tr><td width="8%"><p>208</p></td><td width="34%"><p>Фонтанезия форчуна</p></td><td width="28%"><p>Фонтанезия форчуна</p></td><td colspan="2" width="29%"><p>Fontanesiafortunei</p></td></tr><tr><td width="8%"><p>209</p></td><td width="34%"><p>Фисташка обыкновенная</p></td><td width="28%"><p>Кәдімгі пыста</p></td><td colspan="2" width="29%"><p>Pistаćiavеŕa</p></td></tr><tr><td width="8%"><p>210</p></td><td width="34%"><p>Хурма восточная</p></td><td width="28%"><p>Шығыс құрма</p></td><td colspan="2" width="29%"><p>Diōspyroskāki</p></td></tr><tr><td width="8%"><p>211</p></td><td width="34%"><p>Чубушник белая (жасмин)</p></td><td width="28%"><p>Ақ гүл</p></td><td colspan="2" width="29%"><p>Philadelphus alba</p></td></tr><tr><td width="8%"><p>212</p></td><td width="34%"><p>Чингиль серебристый</p></td><td width="28%"><p>Ақ шеңгел</p></td><td colspan="2" width="29%"><p>Halimodendronhalodendron</p></td></tr><tr><td width="8%"><p>213</p></td><td width="34%"><p>Шелковица зонтичная</p></td><td width="28%"><p>Зонтик тәрізді тұт</p></td><td colspan="2" width="29%"><p>Moŕus</p></td></tr><tr><td width="8%"><p>214</p></td><td width="34%"><p>Шелковица спиральная</p></td><td width="28%"><p>Спиральды тұт</p></td><td colspan="2" width="29%"><p>M&oacute;rusfortuoza</p></td></tr><tr><td width="61">&nbsp;</td><td width="240">&nbsp;</td><td width="199">&nbsp;</td><td width="10">&nbsp;</td><td width="197">&nbsp;</td></tr></tbody></table>',
    },
    {
      id: 8,
      title: 'Жасыл белдеу',
      image_url: 'assets/images/green.jpg',
      description:
        '<p><strong>Тұқымбақ бойынша мәлімет</strong></p><p><strong>&nbsp;</strong></p><p>Шымкент қаласының жайлы ортаны дамыту басқармасына қарасты &laquo;Жасыл белдеу&raquo; КММ теңгерімінде аумағы жалпы<strong>83</strong>гектарды құрайды.</p><p>Аталған тұқымбақта Шымкент қаласының жасыл белдеуінің көлемін ұлғайту және қала көшелерін көгалдандыруға қажетті<strong>16</strong>түрлі ағаш түрлері: терек, бүйреген, жиде, шынар, бұйратал, қаратал, талшын, бозарша, жай-арша, емен, үйеңкі және қылқан жапырақты ағаштар мен&nbsp; роза гүл тұқымдары себіліп өсірілуде.</p><p>Алдағы уақытта қосымша жеміс ағаштары мен сәндік ағаш-бұта көшеттерінің<strong>30</strong>-ға жуық түрлерін өсіру жоспарлануда.</p><p>&nbsp;</p>',
      sub_desc:
        '<p><strong>&laquo;Жасыл белдеу&raquo; КММ-нің&nbsp; теңгеріміндегі жерлер бойынша мәлімет.</strong></p><p>Шымкент қаласының жайлы ортаны дамыту басқармасына қарасты &laquo;Жасыл белдеу&raquo; КММ-нің теңгеріміндегі Қайнар бұлақ шағын ауданында орналасқан көлемі<strong>976</strong>гектарды құрайтын жер телімі бар.&nbsp;</p><p>Аталған жер теліміне инвестор тартып көгалдандыру мақсатында<strong>10</strong>жылға дейінгі мерзімге жалға беру жоспарлануда.</p><p>Сонымен қатар, &laquo;Жасыл белдеу&raquo; КММ-нің теңгеріміндегі Шымкент-Термез жол бағытындағы &laquo;Комсомол көлі&raquo; аумағындағы<strong>613</strong>гектар жер телімі ішінен<strong>150</strong>гектар жер теліміне инвесторлар арқылы демалыс аймағы, сквер, балалар ойын алаңдарын орнату жоспарлануда.</p>',
      table: null,
    },
  ];
  staticArea: {
    id: number;
    title: string;
    image_url: string;
    description: string;
    sub_desc: string;
    table: string | null;
  } | null = null;
  actualLayer: any[] = [];
  event_filter: number[] = [];
  status_filter: number[] = [];
  category_filter: number[] = [];
  sanitary_filter: number[] = [];
  breed_filter: number[] = [];
  type_filter: number[] = [];
  search_polygon: string = '';
  search_word = '';
  treeIcon = icon({
    iconUrl: 'https://dpbh.ucla.edu/wp-content/uploads/2021/10/tree_icon.png',
    iconSize: [25, 25],
    iconAnchor: [25, 25],
  });
  //@ts-ignore
  activeMarker: Marker;
  activeBush: Bush | null = null;
  selectedTreeIcon = icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/148/148767.png',
    iconSize: [25, 25],
    iconAnchor: [25, 25],
  });
  selectedMarker: any = null;
  baseApiImage = environment.baseUrlImage;
  baseApi = environment.baseUrl;
  options = {
    preferCanvas: true,
    layers: [
      // tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',  {subdomains:['mt0','mt1','mt2','mt3'], maxZoom: 21, maxNativeZoom: 20, attribution: '...' })
      tileLayer('https://tile4.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=4', {
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        maxZoom: 18,
        maxNativeZoom: 18,
        attribution: '...',
      }),
    ],
    zoom: 14,
    center: latLng(49.801993, 72.828387),
  };
  MULTI_SELECT_CONFIG: any = Object.assign(
    {},
    {
      highlight: false,
      create: false,
      persist: true,
      plugins: ['dropdown_direction', 'remove_button'],
      dropdownDirection: 'down',
    },
    {
      labelField: 'title_ru',
      valueField: 'id',
      searchField: ['title_ru'],
      maxItems: 50,
    },
  );
  baseBreedsImage = environment.baseBreedsImage;

  ngOnInit(): void {
    initTE({ Collapse });
  }

  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private areaService: AreaService,
    private placeService: PlaceService,
    private markerService: MarkerService,
    private bushService: BushService,
    private systemService: SystemDataService,
  ) {
    this.initializeSystemData();
    this.initializeArea();
  }

  onZoom($event: any) {
    let actualZoom = $event.target.getZoom();
    this.Layer = Array.from(this.actualLayer);
    if (actualZoom >= this.maxZoom) {
      let bounds = $event.target.getBounds();
      let search_polygon = polygon([
        bounds._southWest,
        latLng(bounds._northEast.lat, bounds._southWest.lng), // Top-left coordinate
        bounds._northEast,
        latLng(bounds._southWest.lat, bounds._northEast.lng),
      ]);
      //@ts-ignore
      this.search_polygon = JSON.stringify(search_polygon.toGeoJSON());
      this.initializeMarker();
    } else {
      this.makers = [];
      this.Layer = Array.from(this.actualLayer);
    }
  }

  initializeSystemData() {
    this.systemService.getAll().subscribe((data) => {
      this.SystemData = data;
    });
  }

  initializeArea() {
    this.areaService.getAll().subscribe((data) => {
      this.areas = data;
      this.recreateLayer();
    });
  }

  initializePlace() {
    this.placeService.getAll(this.activeAreas).subscribe((data) => {
      this.places = data;
      this.activePlaces = this.activePlaces.filter((activeItemId) =>
        this.places.some((place) => place.id === activeItemId),
      );
      this.initializeBush();
    });
  }

  initializeBush() {
    if (!this.activePlaces.length) {
      this.bushes = [];
      this.recreateLayer();
      return;
    }

    this.bushService.getAll(this.activePlaces).subscribe({
      next: (data) => {
        this.bushes = data;
        this.recreateLayer();
      },
      error: (error) => {
        this.bushes = [];
        console.error('Не удалось загрузить линейные посадки кустов', error);
        this.recreateLayer();
      },
    });
  }

  initializeMarker() {
    if (this.activePlaces.length) {
      this.markerService
        .getAll(this.activePlaces, this.search_polygon, this.activeFilters)
        .subscribe((data) => {
          this.makers = data;
          this.makers.forEach((itemMarker) => {
            let geocode = JSON.parse(itemMarker.geocode);
            // @ts-ignore
            this.Layer.push(
              marker([geocode.lat, geocode.lng], {
                icon: this.getTreeIcon(
                  itemMarker.sanitary_id,
                  itemMarker.type_id,
                ),
              }).on('click', (e) => this.clickFeauturePoint(e, itemMarker)),
            );
          });
        });
    }
  }

  AddLayer(
    geocode: string,
    bg_color: string,
    title_ru: string,
    area_id: number | null = null,
  ) {
    let data = geoJSON(JSON.parse(geocode));
    data.setStyle({
      color: bg_color,
    });
    data.bindTooltip(title_ru, {
      permanent: true,
      offset: [0, 12],
    });
    // Don't open special modal for Дендропарк (id 7) and Жасыл белдеу (id 8)
    if (area_id !== 7 && area_id !== 8) {
      data.on('click', (e) => this.clickSpecialArea(e, area_id));
    }
    // @ts-ignore
    this.Layer.push(data);
  }

  AddBushLayer(bush: Bush) {
    try {
      const data = geoJSON(JSON.parse(bush.geocode));
      data.setStyle({
        color: '#15803d',
        weight: 10,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      });
      data.on('click', () => this.clickFeatureBush(bush));
      this.Layer.push(data);
    } catch (error) {
      console.warn(`Некорректная геометрия кустов #${bush.id}`, error);
    }
  }

  clickFeatureBush(bush: Bush) {
    this.activeBush = bush;
    this.ngxSmartModalService.getModal('bushModal').open();
  }

  toggleArea(id: number) {
    let index = this.activeAreas.indexOf(id);
    index == -1 ? this.activeAreas.push(id) : this.activeAreas.splice(index, 1);
    this.initializePlace();
  }

  togglePlaces(id: number) {
    let index = this.activePlaces.indexOf(id);
    index == -1
      ? this.activePlaces.push(id)
      : this.activePlaces.splice(index, 1);
    this.initializeBush();
  }

  getBreedImage(id: number) {
    try {
      // @ts-ignore
      let element = this.SystemData['breed'].find((item) => item.id == id);
      if (element) {
        return this.baseBreedsImage + element.image_url;
      }
      return 'https://obuchonok.ru/files/images/derevo.jpg';
    } catch (e) {
      return 'https://obuchonok.ru/files/images/derevo.jpg';
    }
  }

  getLatLng(geocode: string): string {
    try {
      let latlng = JSON.parse(geocode);
      return `Широта ${latlng.lat}, Долгота ${latlng.lng}.`;
    } catch (e) {
      return '-';
    }
  }

  recreateLayer() {
    this.Layer = [];
    if (this.activeAreas.length > 0) {
      this.areas.forEach((itemArea) => {
        if (this.activeAreas.indexOf(itemArea.id) != -1) {
          this.AddLayer(
            itemArea.geocode,
            itemArea.bg_color,
            itemArea.title_ru,
            itemArea.id,
          );
        }
      });
      this.places.forEach((item) => {
        if (
          this.activePlaces.indexOf(item.id) != -1 &&
          this.activeAreas.includes(item.area_id)
        ) {
          this.AddLayer(item.geocode, item.bg_color, item.title_ru);
        }
      });
      this.bushes.forEach((bush) => {
        if (this.activePlaces.includes(bush.place_id)) {
          this.AddBushLayer(bush);
        }
      });
    }
    this.actualLayer = this.Layer;
  }

  clickFeauturePoint(e: LeafletMouseEvent, item: Marker) {
    if (this.selectedMarker) {
      // Revert the icon of the previously clicked marker
      this.selectedMarker.setIcon(
        this.getTreeIcon(item.sanitary_id, item.type_id),
      );
    }
    // Change the icon of the clicked marker
    e.target.setIcon(this.selectedTreeIcon);
    // Store the reference to the currently clicked marker
    this.selectedMarker = e.target;
    this.activeMarker = item;
    this.ngxSmartModalService.getModal('myModal').open();
  }

  clickSpecialArea(e: LeafletMouseEvent, areaId: number | null = null) {
    if (areaId) {
      let findedArea = this.staticAreaInfo?.find((item) => item.id == areaId);
      if (findedArea) {
        this.staticArea = findedArea;
        this.ngxSmartModalService.getModal('specialDataModal').open();
      }
    }
  }

  toggleFilters() {
    this.Layer = Array.from(this.actualLayer);
    this.activeFilters = {
      event: this.event_filter,
      status: this.status_filter,
      category: this.category_filter,
      sanitary: this.sanitary_filter,
      breed: this.breed_filter,
      type: this.type_filter,
    };
    this.initializeMarker();
  }

  getTitle(property: string, id: number) {
    try {
      // @ts-ignore
      let element = this.SystemData[property].find((item) => item.id == id);
      return element.title_ru;
    } catch (e) {
      return 'Неизвестно';
    }
  }

  getTreeIcon(
    sanitary_id: number | null,
    type_id: number | null,
  ): Icon<IconOptions> {
    if (this.SystemData.sanitary) {
      var img =
        'https://dpbh.ucla.edu/wp-content/uploads/2021/10/tree_icon.png';
      if (this.SystemData.sanitary_type.length) {
        var icons = this.SystemData.sanitary_type.find(
          (item) => item.sanitary_id == sanitary_id && item.type_id == type_id,
        );
        if (icons != null) {
          img = this.baseApiImage + icons.image_url;
        }
      }

      return icon({
        iconUrl: img,
        iconSize: [25, 25],
        iconAnchor: [25, 25],
      });
    }
    return icon({
      iconUrl: 'https://dpbh.ucla.edu/wp-content/uploads/2021/10/tree_icon.png',
      iconSize: [25, 25],
      iconAnchor: [25, 25],
    });
  }
}
