import React from "react";

export default function CountryCallingCodeSelect(props) {
    return (
        <select className={props.className} name={props.name} onChange={props.onChange} value={props.value}>
            <option>Select Country</option>
            <option value="93" callingCode="93" alpha2Code="AF" alpha3Code="AFG">Afghanistan (+93)</option>
            <option value="355" callingCode="355" alpha2Code="AL" alpha3Code="ALB">Albania (+355)</option>
            <option value="213" callingCode="213" alpha2Code="DZ" alpha3Code="DZA">Algeria (+213)</option>
            <option value="1684" callingCode="1684" alpha2Code="AS" alpha3Code="ASM">American Samoa (+1684)</option>
            <option value="376" callingCode="376" alpha2Code="AD" alpha3Code="AND">Andorra (+376)</option>
            <option value="244" callingCode="244" alpha2Code="AO" alpha3Code="AGO">Angola (+244)</option>
            <option value="1264" callingCode="1264" alpha2Code="AI" alpha3Code="AIA">Anguilla (+1264)</option>
            <option value="672" callingCode="672" alpha2Code="AQ" alpha3Code="ATA">Antarctica (+672)</option>
            <option value="1268" callingCode="1268" alpha2Code="AG" alpha3Code="ATG">Antigua and Barbuda (+1268)</option>
            <option value="54" callingCode="54" alpha2Code="AR" alpha3Code="ARG">Argentina (+54)</option>
            <option value="374" callingCode="374" alpha2Code="AM" alpha3Code="ARM">Armenia (+374)</option>
            <option value="297" callingCode="297" alpha2Code="AW" alpha3Code="ABW">Aruba (+297)</option>
            <option value="61" callingCode="61" alpha2Code="AU" alpha3Code="AUS">Australia (+61)</option>
            <option value="43" callingCode="43" alpha2Code="AT" alpha3Code="AUT">Austria (+43)</option>
            <option value="994" callingCode="994" alpha2Code="AZ" alpha3Code="AZE">Azerbaijan (+994)</option>
            <option value="1242" callingCode="1242" alpha2Code="BS" alpha3Code="BHS">Bahamas (+1242)</option>
            <option value="973" callingCode="973" alpha2Code="BH" alpha3Code="BHR">Bahrain (+973)</option>
            <option value="880" callingCode="880" alpha2Code="BD" alpha3Code="BGD">Bangladesh (+880)</option>
            <option value="1246" callingCode="1246" alpha2Code="BB" alpha3Code="BRB">Barbados (+1246)</option>
            <option value="375" callingCode="375" alpha2Code="BY" alpha3Code="BLR">Belarus (+375)</option>
            <option value="32" callingCode="32" alpha2Code="BE" alpha3Code="BEL">Belgium (+32)</option>
            <option value="501" callingCode="501" alpha2Code="BZ" alpha3Code="BLZ">Belize (+501)</option>
            <option value="229" callingCode="229" alpha2Code="BJ" alpha3Code="BEN">Benin (+229)</option>
            <option value="1441" callingCode="1441" alpha2Code="BM" alpha3Code="BMU">Bermuda (+1441)</option>
            <option value="975" callingCode="975" alpha2Code="BT" alpha3Code="BTN">Bhutan (+975)</option>
            <option value="591" callingCode="591" alpha2Code="BO" alpha3Code="BOL">Bolivia (+591)</option>
            <option value="387" callingCode="387" alpha2Code="BA" alpha3Code="BIH">Bosnia and Herzegovina (+387)</option>
            <option value="267" callingCode="267" alpha2Code="BW" alpha3Code="BWA">Botswana (+267)</option>
            <option value="55" callingCode="55" alpha2Code="BR" alpha3Code="BRA">Brazil (+55)</option>
            <option value="246" callingCode="246" alpha2Code="IO" alpha3Code="IOT">British Indian Ocean Territory (+246)</option>
            <option value="1284" callingCode="1284" alpha2Code="VG" alpha3Code="VGB">British Virgin Islands (+1284)</option>
            <option value="673" callingCode="673" alpha2Code="BN" alpha3Code="BRN">Brunei (+673)</option>
            <option value="359" callingCode="359" alpha2Code="BG" alpha3Code="BGR">Bulgaria (+359)</option>
            <option value="226" callingCode="226" alpha2Code="BF" alpha3Code="BFA">Burkina Faso (+226)</option>
            <option value="95" callingCode="95" alpha2Code="MM" alpha3Code="MMR">Myanmar (+95)</option>
            <option value="257" callingCode="257" alpha2Code="BI" alpha3Code="BDI">Burundi (+257)</option>
            <option value="855" callingCode="855" alpha2Code="KH" alpha3Code="KHM">Cambodia (+855)</option>
            <option value="237" callingCode="237" alpha2Code="CM" alpha3Code="CMR">Cameroon (+237)</option>
            <option value="1" callingCode="1" alpha2Code="CA" alpha3Code="CAN">Canada (+1)</option>
            <option value="238" callingCode="238" alpha2Code="CV" alpha3Code="CPV">Cape Verde (+238)</option>
            <option value="1345" callingCode="1345" alpha2Code="KY" alpha3Code="CYM">Cayman Islands (+1345)</option>
            <option value="236" callingCode="236" alpha2Code="CF" alpha3Code="CAF">Central African Republic (+236)</option>
            <option value="235" callingCode="235" alpha2Code="TD" alpha3Code="TCD">Chad (+235)</option>
            <option value="56" callingCode="56" alpha2Code="CL" alpha3Code="CHL">Chile (+56)</option>
            <option value="86" callingCode="86" alpha2Code="CN" alpha3Code="CHN">China (+86)</option>
            <option value="61" callingCode="61" alpha2Code="CX" alpha3Code="CXR">Christmas Island (+61)</option>
            <option value="61" callingCode="61" alpha2Code="CC" alpha3Code="CCK">Cocos Islands (+61)</option>
            <option value="57" callingCode="57" alpha2Code="CO" alpha3Code="COL">Colombia (+57)</option>
            <option value="269" callingCode="269" alpha2Code="KM" alpha3Code="COM">Comoros (+269)</option>
            <option value="242" callingCode="242" alpha2Code="CG" alpha3Code="COG">Republic of the Congo (+242)</option>
            <option value="243" callingCode="243" alpha2Code="CD" alpha3Code="COD">Democratic Republic of the Congo (+243)</option>
            <option value="682" callingCode="682" alpha2Code="CK" alpha3Code="COK">Cook Islands (+682)</option>
            <option value="506" callingCode="506" alpha2Code="CR" alpha3Code="CRI">Costa Rica (+506)</option>
            <option value="385" callingCode="385" alpha2Code="HR" alpha3Code="HRV">Croatia (+385)</option>
            <option value="53" callingCode="53" alpha2Code="CU" alpha3Code="CUB">Cuba (+53)</option>
            <option value="599" callingCode="599" alpha2Code="CW" alpha3Code="CUW">Curacao (+599)</option>
            <option value="357" callingCode="357" alpha2Code="CY" alpha3Code="CYP">Cyprus (+357)</option>
            <option value="420" callingCode="420" alpha2Code="CZ" alpha3Code="CZE">Czech Republic (+420)</option>
            <option value="45" callingCode="45" alpha2Code="DK" alpha3Code="DNK">Denmark (+45)</option>
            <option value="253" callingCode="253" alpha2Code="DJ" alpha3Code="DJI">Djibouti (+253)</option>
            <option value="1767" callingCode="1767" alpha2Code="DM" alpha3Code="DMA">Dominica (+1767)</option>
            <option value="1809" callingCode="1809" alpha2Code="DO" alpha3Code="DOM">Dominican Republic (+1809)</option>
            <option value="1829" callingCode="1829" alpha2Code="DO" alpha3Code="DOM">Dominican Republic (+1829)</option>
            <option value="1849" callingCode="1849" alpha2Code="DO" alpha3Code="DOM">Dominican Republic (+1849)</option>
            <option value="670" callingCode="670" alpha2Code="TL" alpha3Code="TLS">East Timor (+670)</option>
            <option value="593" callingCode="593" alpha2Code="EC" alpha3Code="ECU">Ecuador (+593)</option>
            <option value="20" callingCode="20" alpha2Code="EG" alpha3Code="EGY">Egypt (+20)</option>
            <option value="503" callingCode="503" alpha2Code="SV" alpha3Code="SLV">El Salvador (+503)</option>
            <option value="240" callingCode="240" alpha2Code="GQ" alpha3Code="GNQ">Equatorial Guinea (+240)</option>
            <option value="291" callingCode="291" alpha2Code="ER" alpha3Code="ERI">Eritrea (+291)</option>
            <option value="372" callingCode="372" alpha2Code="EE" alpha3Code="EST">Estonia (+372)</option>
            <option value="251" callingCode="251" alpha2Code="ET" alpha3Code="ETH">Ethiopia (+251)</option>
            <option value="500" callingCode="500" alpha2Code="FK" alpha3Code="FLK">Falkland Islands (+500)</option>
            <option value="298" callingCode="298" alpha2Code="FO" alpha3Code="FRO">Faroe Islands (+298)</option>
            <option value="679" callingCode="679" alpha2Code="FJ" alpha3Code="FJI">Fiji (+679)</option>
            <option value="358" callingCode="358" alpha2Code="FI" alpha3Code="FIN">Finland (+358)</option>
            <option value="33" callingCode="33" alpha2Code="FR" alpha3Code="FRA">France (+33)</option>
            <option value="689" callingCode="689" alpha2Code="PF" alpha3Code="PYF">French Polynesia (+689)</option>
            <option value="241" callingCode="241" alpha2Code="GA" alpha3Code="GAB">Gabon (+241)</option>
            <option value="220" callingCode="220" alpha2Code="GM" alpha3Code="GMB">Gambia (+220)</option>
            <option value="995" callingCode="995" alpha2Code="GE" alpha3Code="GEO">Georgia (+995)</option>
            <option value="49" callingCode="49" alpha2Code="DE" alpha3Code="DEU">Germany (+49)</option>
            <option value="233" callingCode="233" alpha2Code="GH" alpha3Code="GHA">Ghana (+233)</option>
            <option value="350" callingCode="350" alpha2Code="GI" alpha3Code="GIB">Gibraltar (+350)</option>
            <option value="30" callingCode="30" alpha2Code="GR" alpha3Code="GRC">Greece (+30)</option>
            <option value="299" callingCode="299" alpha2Code="GL" alpha3Code="GRL">Greenland (+299)</option>
            <option value="1473" callingCode="1473" alpha2Code="GD" alpha3Code="GRD">Grenada (+1473)</option>
            <option value="1671" callingCode="1671" alpha2Code="GU" alpha3Code="GUM">Guam (+1671)</option>
            <option value="502" callingCode="502" alpha2Code="GT" alpha3Code="GTM">Guatemala (+502)</option>
            <option value="441481" callingCode="441481" alpha2Code="GG" alpha3Code="GGY">Guernsey (+441481)</option>
            <option value="224" callingCode="224" alpha2Code="GN" alpha3Code="GIN">Guinea (+224)</option>
            <option value="245" callingCode="245" alpha2Code="GW" alpha3Code="GNB">Guinea-Bissau (+245)</option>
            <option value="592" callingCode="592" alpha2Code="GY" alpha3Code="GUY">Guyana (+592)</option>
            <option value="509" callingCode="509" alpha2Code="HT" alpha3Code="HTI">Haiti (+509)</option>
            <option value="504" callingCode="504" alpha2Code="HN" alpha3Code="HND">Honduras (+504)</option>
            <option value="852" callingCode="852" alpha2Code="HK" alpha3Code="HKG">Hong Kong (+852)</option>
            <option value="36" callingCode="36" alpha2Code="HU" alpha3Code="HUN">Hungary (+36)</option>
            <option value="354" callingCode="354" alpha2Code="IS" alpha3Code="ISL">Iceland (+354)</option>
            <option value="91" callingCode="91" alpha2Code="IN" alpha3Code="IND">India (+91)</option>
            <option value="62" callingCode="62" alpha2Code="ID" alpha3Code="IDN">Indonesia (+62)</option>
            <option value="98" callingCode="98" alpha2Code="IR" alpha3Code="IRN">Iran (+98)</option>
            <option value="964" callingCode="964" alpha2Code="IQ" alpha3Code="IRQ">Iraq (+964)</option>
            <option value="353" callingCode="353" alpha2Code="IE" alpha3Code="IRL">Ireland (+353)</option>
            <option value="441624" callingCode="441624" alpha2Code="IM" alpha3Code="IMN">Isle of Man (+441624)</option>
            <option value="972" callingCode="972" alpha2Code="IL" alpha3Code="ISR">Israel (+972)</option>
            <option value="39" callingCode="39" alpha2Code="IT" alpha3Code="ITA">Italy (+39)</option>
            <option value="225" callingCode="225" alpha2Code="CI" alpha3Code="CIV">Ivory Coast (+225)</option>
            <option value="1876" callingCode="1876" alpha2Code="JM" alpha3Code="JAM">Jamaica (+1876)</option>
            <option value="81" callingCode="81" alpha2Code="JP" alpha3Code="JPN">Japan (+81)</option>
            <option value="441534" callingCode="441534" alpha2Code="JE" alpha3Code="JEY">Jersey (+441534)</option>
            <option value="962" callingCode="962" alpha2Code="JO" alpha3Code="JOR">Jordan (+962)</option>
            <option value="7" callingCode="7" alpha2Code="KZ" alpha3Code="KAZ">Kazakhstan (+7)</option>
            <option value="254" callingCode="254" alpha2Code="KE" alpha3Code="KEN">Kenya (+254)</option>
            <option value="686" callingCode="686" alpha2Code="KI" alpha3Code="KIR">Kiribati (+686)</option>
            <option value="383" callingCode="383" alpha2Code="XK" alpha3Code="XKX">Kosovo (+383)</option>
            <option value="965" callingCode="965" alpha2Code="KW" alpha3Code="KWT">Kuwait (+965)</option>
            <option value="996" callingCode="996" alpha2Code="KG" alpha3Code="KGZ">Kyrgyzstan (+996)</option>
            <option value="856" callingCode="856" alpha2Code="LA" alpha3Code="LAO">Laos (+856)</option>
            <option value="371" callingCode="371" alpha2Code="LV" alpha3Code="LVA">Latvia (+371)</option>
            <option value="961" callingCode="961" alpha2Code="LB" alpha3Code="LBN">Lebanon (+961)</option>
            <option value="266" callingCode="266" alpha2Code="LS" alpha3Code="LSO">Lesotho (+266)</option>
            <option value="231" callingCode="231" alpha2Code="LR" alpha3Code="LBR">Liberia (+231)</option>
            <option value="218" callingCode="218" alpha2Code="LY" alpha3Code="LBY">Libya (+218)</option>
            <option value="423" callingCode="423" alpha2Code="LI" alpha3Code="LIE">Liechtenstein (+423)</option>
            <option value="370" callingCode="370" alpha2Code="LT" alpha3Code="LTU">Lithuania (+370)</option>
            <option value="352" callingCode="352" alpha2Code="LU" alpha3Code="LUX">Luxembourg (+352)</option>
            <option value="853" callingCode="853" alpha2Code="MO" alpha3Code="MAC">Macau (+853)</option>
            <option value="389" callingCode="389" alpha2Code="MK" alpha3Code="MKD">Macedonia (+389)</option>
            <option value="261" callingCode="261" alpha2Code="MG" alpha3Code="MDG">Madagascar (+261)</option>
            <option value="265" callingCode="265" alpha2Code="MW" alpha3Code="MWI">Malawi (+265)</option>
            <option value="60" callingCode="60" alpha2Code="MY" alpha3Code="MYS">Malaysia (+60)</option>
            <option value="960" callingCode="960" alpha2Code="MV" alpha3Code="MDV">Maldives (+960)</option>
            <option value="223" callingCode="223" alpha2Code="ML" alpha3Code="MLI">Mali (+223)</option>
            <option value="356" callingCode="356" alpha2Code="MT" alpha3Code="MLT">Malta (+356)</option>
            <option value="692" callingCode="692" alpha2Code="MH" alpha3Code="MHL">Marshall Islands (+692)</option>
            <option value="222" callingCode="222" alpha2Code="MR" alpha3Code="MRT">Mauritania (+222)</option>
            <option value="230" callingCode="230" alpha2Code="MU" alpha3Code="MUS">Mauritius (+230)</option>
            <option value="262" callingCode="262" alpha2Code="YT" alpha3Code="MYT">Mayotte (+262)</option>
            <option value="52" callingCode="52" alpha2Code="MX" alpha3Code="MEX">Mexico (+52)</option>
            <option value="691" callingCode="691" alpha2Code="FM" alpha3Code="FSM">Micronesia (+691)</option>
            <option value="373" callingCode="373" alpha2Code="MD" alpha3Code="MDA">Moldova (+373)</option>
            <option value="377" callingCode="377" alpha2Code="MC" alpha3Code="MCO">Monaco (+377)</option>
            <option value="976" callingCode="976" alpha2Code="MN" alpha3Code="MNG">Mongolia (+976)</option>
            <option value="382" callingCode="382" alpha2Code="ME" alpha3Code="MNE">Montenegro (+382)</option>
            <option value="1664" callingCode="1664" alpha2Code="MS" alpha3Code="MSR">Montserrat (+1664)</option>
            <option value="212" callingCode="212" alpha2Code="MA" alpha3Code="MAR">Morocco (+212)</option>
            <option value="258" callingCode="258" alpha2Code="MZ" alpha3Code="MOZ">Mozambique (+258)</option>
            <option value="264" callingCode="264" alpha2Code="NA" alpha3Code="NAM">Namibia (+264)</option>
            <option value="674" callingCode="674" alpha2Code="NR" alpha3Code="NRU">Nauru (+674)</option>
            <option value="977" callingCode="977" alpha2Code="NP" alpha3Code="NPL">Nepal (+977)</option>
            <option value="31" callingCode="31" alpha2Code="NL" alpha3Code="NLD">Netherlands (+31)</option>
            <option value="599" callingCode="599" alpha2Code="AN" alpha3Code="ANT">Netherlands Antilles (+599)</option>
            <option value="687" callingCode="687" alpha2Code="NC" alpha3Code="NCL">New Caledonia (+687)</option>
            <option value="64" callingCode="64" alpha2Code="NZ" alpha3Code="NZL">New Zealand (+64)</option>
            <option value="505" callingCode="505" alpha2Code="NI" alpha3Code="NIC">Nicaragua (+505)</option>
            <option value="227" callingCode="227" alpha2Code="NE" alpha3Code="NER">Niger (+227)</option>
            <option value="234" callingCode="234" alpha2Code="NG" alpha3Code="NGA">Nigeria (+234)</option>
            <option value="683" callingCode="683" alpha2Code="NU" alpha3Code="NIU">Niue (+683)</option>
            <option value="1670" callingCode="1670" alpha2Code="MP" alpha3Code="MNP">Northern Mariana Islands (+1670)</option>
            <option value="850" callingCode="850" alpha2Code="KP" alpha3Code="PRK">North Korea (+850)</option>
            <option value="47" callingCode="47" alpha2Code="NO" alpha3Code="NOR">Norway (+47)</option>
            <option value="968" callingCode="968" alpha2Code="OM" alpha3Code="OMN">Oman (+968)</option>
            <option value="92" callingCode="92" alpha2Code="PK" alpha3Code="PAK">Pakistan (+92)</option>
            <option value="680" callingCode="680" alpha2Code="PW" alpha3Code="PLW">Palau (+680)</option>
            <option value="970" callingCode="970" alpha2Code="PS" alpha3Code="PSE">Palestine (+970)</option>
            <option value="507" callingCode="507" alpha2Code="PA" alpha3Code="PAN">Panama (+507)</option>
            <option value="675" callingCode="675" alpha2Code="PG" alpha3Code="PNG">Papua New Guinea (+675)</option>
            <option value="595" callingCode="595" alpha2Code="PY" alpha3Code="PRY">Paraguay (+595)</option>
            <option value="51" callingCode="51" alpha2Code="PE" alpha3Code="PER">Peru (+51)</option>
            <option value="63" callingCode="63" alpha2Code="PH" alpha3Code="PHL">Philippines (+63)</option>
            <option value="64" callingCode="64" alpha2Code="PN" alpha3Code="PCN">Pitcairn (+64)</option>
            <option value="48" callingCode="48" alpha2Code="PL" alpha3Code="POL">Poland (+48)</option>
            <option value="351" callingCode="351" alpha2Code="PT" alpha3Code="PRT">Portugal (+351)</option>
            <option value="1787" callingCode="1787" alpha2Code="PR" alpha3Code="PRI">Puerto Rico (+1787)</option>
            <option value="1939" callingCode="1939" alpha2Code="PR" alpha3Code="PRI">Puerto Rico (+1939)</option>
            <option value="974" callingCode="974" alpha2Code="QA" alpha3Code="QAT">Qatar (+974)</option>
            <option value="262" callingCode="262" alpha2Code="RE" alpha3Code="REU">Reunion (+262)</option>
            <option value="40" callingCode="40" alpha2Code="RO" alpha3Code="ROU">Romania (+40)</option>
            <option value="7" callingCode="7" alpha2Code="RU" alpha3Code="RUS">Russia (+7)</option>
            <option value="250" callingCode="250" alpha2Code="RW" alpha3Code="RWA">Rwanda (+250)</option>
            <option value="590" callingCode="590" alpha2Code="BL" alpha3Code="BLM">Saint Barthelemy (+590)</option>
            <option value="685" callingCode="685" alpha2Code="WS" alpha3Code="WSM">Samoa (+685)</option>
            <option value="378" callingCode="378" alpha2Code="SM" alpha3Code="SMR">San Marino (+378)</option>
            <option value="239" callingCode="239" alpha2Code="ST" alpha3Code="STP">Sao Tome and Principe (+239)</option>
            <option value="966" callingCode="966" alpha2Code="SA" alpha3Code="SAU">Saudi Arabia (+966)</option>
            <option value="221" callingCode="221" alpha2Code="SN" alpha3Code="SEN">Senegal (+221)</option>
            <option value="381" callingCode="381" alpha2Code="RS" alpha3Code="SRB">Serbia (+381)</option>
            <option value="248" callingCode="248" alpha2Code="SC" alpha3Code="SYC">Seychelles (+248)</option>
            <option value="232" callingCode="232" alpha2Code="SL" alpha3Code="SLE">Sierra Leone (+232)</option>
            <option value="65" callingCode="65" alpha2Code="SG" alpha3Code="SGP">Singapore (+65)</option>
            <option value="1721" callingCode="1721" alpha2Code="SX" alpha3Code="SXM">Sint Maarten (+1721)</option>
            <option value="421" callingCode="421" alpha2Code="SK" alpha3Code="SVK">Slovakia (+421)</option>
            <option value="386" callingCode="386" alpha2Code="SI" alpha3Code="SVN">Slovenia (+386)</option>
            <option value="677" callingCode="677" alpha2Code="SB" alpha3Code="SLB">Solomon Islands (+677)</option>
            <option value="252" callingCode="252" alpha2Code="SO" alpha3Code="SOM">Somalia (+252)</option>
            <option value="27" callingCode="27" alpha2Code="ZA" alpha3Code="ZAF">South Africa (+27)</option>
            <option value="82" callingCode="82" alpha2Code="KR" alpha3Code="KOR">South Korea (+82)</option>
            <option value="211" callingCode="211" alpha2Code="SS" alpha3Code="SSD">South Sudan (+211)</option>
            <option value="34" callingCode="34" alpha2Code="ES" alpha3Code="ESP">Spain (+34)</option>
            <option value="94" callingCode="94" alpha2Code="LK" alpha3Code="LKA">Sri Lanka (+94)</option>
            <option value="290" callingCode="290" alpha2Code="SH" alpha3Code="SHN">Saint Helena (+290)</option>
            <option value="1869" callingCode="1869" alpha2Code="KN" alpha3Code="KNA">Saint Kitts and Nevis (+1869)</option>
            <option value="1758" callingCode="1758" alpha2Code="LC" alpha3Code="LCA">Saint Lucia (+1758)</option>
            <option value="590" callingCode="590" alpha2Code="MF" alpha3Code="MAF">Saint Martin (+590)</option>
            <option value="508" callingCode="508" alpha2Code="PM" alpha3Code="SPM">Saint Pierre and Miquelon (+508)</option>
            <option value="1784" callingCode="1784" alpha2Code="VC" alpha3Code="VCT">Saint Vincent and the Grenadines (+1784)</option>
            <option value="249" callingCode="249" alpha2Code="SD" alpha3Code="SDN">Sudan (+249)</option>
            <option value="597" callingCode="597" alpha2Code="SR" alpha3Code="SUR">Suriname (+597)</option>
            <option value="47" callingCode="47" alpha2Code="SJ" alpha3Code="SJM">Svalbard and Jan Mayen (+47)</option>
            <option value="268" callingCode="268" alpha2Code="SZ" alpha3Code="SWZ">Swaziland (+268)</option>
            <option value="46" callingCode="46" alpha2Code="SE" alpha3Code="SWE">Sweden (+46)</option>
            <option value="41" callingCode="41" alpha2Code="CH" alpha3Code="CHE">Switzerland (+41)</option>
            <option value="963" callingCode="963" alpha2Code="SY" alpha3Code="SYR">Syria (+963)</option>
            <option value="886" callingCode="886" alpha2Code="TW" alpha3Code="TWN">Taiwan (+886)</option>
            <option value="992" callingCode="992" alpha2Code="TJ" alpha3Code="TJK">Tajikistan (+992)</option>
            <option value="255" callingCode="255" alpha2Code="TZ" alpha3Code="TZA">Tanzania (+255)</option>
            <option value="66" callingCode="66" alpha2Code="TH" alpha3Code="THA">Thailand (+66)</option>
            <option value="228" callingCode="228" alpha2Code="TG" alpha3Code="TGO">Togo (+228)</option>
            <option value="690" callingCode="690" alpha2Code="TK" alpha3Code="TKL">Tokelau (+690)</option>
            <option value="676" callingCode="676" alpha2Code="TO" alpha3Code="TON">Tonga (+676)</option>
            <option value="1868" callingCode="1868" alpha2Code="TT" alpha3Code="TTO">Trinidad and Tobago (+1868)</option>
            <option value="216" callingCode="216" alpha2Code="TN" alpha3Code="TUN">Tunisia (+216)</option>
            <option value="90" callingCode="90" alpha2Code="TR" alpha3Code="TUR">Turkey (+90)</option>
            <option value="993" callingCode="993" alpha2Code="TM" alpha3Code="TKM">Turkmenistan (+993)</option>
            <option value="1649" callingCode="1649" alpha2Code="TC" alpha3Code="TCA">Turks and Caicos Islands (+1649)</option>
            <option value="688" callingCode="688" alpha2Code="TV" alpha3Code="TUV">Tuvalu (+688)</option>
            <option value="971" callingCode="971" alpha2Code="AE" alpha3Code="ARE">United Arab Emirates (+971)</option>
            <option value="256" callingCode="256" alpha2Code="UG" alpha3Code="UGA">Uganda (+256)</option>
            <option value="44" callingCode="44" alpha2Code="GB" alpha3Code="GBR">United Kingdom (+44)</option>
            <option value="380" callingCode="380" alpha2Code="UA" alpha3Code="UKR">Ukraine (+380)</option>
            <option value="598" callingCode="598" alpha2Code="UY" alpha3Code="URY">Uruguay (+598)</option>
            <option value="1" callingCode="1" alpha2Code="US" alpha3Code="USA">United States (+1)</option>
            <option value="998" callingCode="998" alpha2Code="UZ" alpha3Code="UZB">Uzbekistan (+998)</option>
            <option value="678" callingCode="678" alpha2Code="VU" alpha3Code="VUT">Vanuatu (+678)</option>
            <option value="379" callingCode="379" alpha2Code="VA" alpha3Code="VAT">Vatican (+379)</option>
            <option value="58" callingCode="58" alpha2Code="VE" alpha3Code="VEN">Venezuela (+58)</option>
            <option value="84" callingCode="84" alpha2Code="VN" alpha3Code="VNM">Vietnam (+84)</option>
            <option value="1340" callingCode="1340" alpha2Code="VI" alpha3Code="VIR">U.S. Virgin Islands (+1340)</option>
            <option value="681" callingCode="681" alpha2Code="WF" alpha3Code="WLF">Wallis and Futuna (+681)</option>
            <option value="212" callingCode="212" alpha2Code="EH" alpha3Code="ESH">Western Sahara (+212)</option>
            <option value="967" callingCode="967" alpha2Code="YE" alpha3Code="YEM">Yemen (+967)</option>
            <option value="260" callingCode="260" alpha2Code="ZM" alpha3Code="ZMB">Zambia (+260)</option>
            <option value="263" callingCode="263" alpha2Code="ZW" alpha3Code="ZWE">Zimbabwe (+263)</option>

        </select>
    );
}
