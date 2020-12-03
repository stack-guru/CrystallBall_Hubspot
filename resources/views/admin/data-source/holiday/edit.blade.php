@extends('layouts.admin')
@section('page-title','Payment History')
@section('content')

    <div class="contianer">
        <div class="row ml-0 mr-0 justify-content-center">
            <div class="col-md-10 p-5">
                <h1 class="my-4 ">Create holiday</h1>

                <form action="{{route('admin.data-source.holiday.update',$holiday->id)}}" method="post">
                    @csrf
                    @method('PUT')
                    <div class="form-group">
                        <label for="">Category</label>
                        <input type="text" name="category" id="category" value="{{old('category',$holiday->category)}}" class="form-control">
                        @error('category')
                        <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="event_name">Event name</label>
                        <input type="text" name="event_name" id="event_name" value="{{old('event_name',$holiday->event_name)}}" class="form-control">
                        @error('event_name')
                        <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="">Description</label>
                        <textarea  name="description" id="description" class="form-control" rows="5" >{{old('description',$holiday->description)}}</textarea>
                        @error('description')
                        <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="">Country Name</label>
                        <select class="form-control" name="country_name" value="AX" >
                            <option value="AF"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Afghanistan</option>
                            <option value="AX"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Åland Islands</option>
                            <option value="AL"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Albania</option>
                            <option value="DZ"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Algeria</option>
                            <option value="AS"  {{$holiday->country_name == old('country_name')? "selected" : null}}>American Samoa</option>
                            <option value="AD"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Andorra</option>
                            <option value="AO"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Angola</option>
                            <option value="AI"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Anguilla</option>
                            <option value="AQ"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Antarctica</option>
                            <option value="AG"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Antigua and Barbuda</option>
                            <option value="AR"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Argentina</option>
                            <option value="AM"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Armenia</option>
                            <option value="AW"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Aruba</option>
                            <option value="AU"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Australia</option>
                            <option value="AT"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Austria</option>
                            <option value="AZ"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Azerbaijan</option>
                            <option value="BS"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Bahamas</option>
                            <option value="BH"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Bahrain</option>
                            <option value="BD"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Bangladesh</option>
                            <option value="BB"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Barbados</option>
                            <option value="BY"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Belarus</option>
                            <option value="BE"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Belgium</option>
                            <option value="BZ"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Belize</option>
                            <option value="BJ"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Benin</option>
                            <option value="BM"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Bermuda</option>
                            <option value="BT"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Bhutan</option>
                            <option value="BO"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Bolivia, Plurinational State of</option>
                            <option value="BQ"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Bonaire, Sint Eustatius and Saba</option>
                            <option value="BA"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Bosnia and Herzegovina</option>
                            <option value="BW"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Botswana</option>
                            <option value="BV"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Bouvet Island</option>
                            <option value="BR"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Brazil</option>
                            <option value="IO"  {{$holiday->country_name == old('country_name')? "selected" : null}}>British Indian Ocean Territory</option>
                            <option value="BN"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Brunei Darussalam</option>
                            <option value="BG"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Bulgaria</option>
                            <option value="BF"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Burkina Faso</option>
                            <option value="BI"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Burundi</option>
                            <option value="KH"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Cambodia</option>
                            <option value="CM"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Cameroon</option>
                            <option value="CA"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Canada</option>
                            <option value="CV"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Cape Verde</option>
                            <option value="KY"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Cayman Islands</option>
                            <option value="CF"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Central African Republic</option>
                            <option value="TD"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Chad</option>
                            <option value="CL"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Chile</option>
                            <option value="CN"  {{$holiday->country_name == old('country_name')? "selected" : null}}>China</option>
                            <option value="CX"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Christmas Island</option>
                            <option value="CC"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Cocos (Keeling) Islands</option>
                            <option value="CO"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Colombia</option>
                            <option value="KM"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Comoros</option>
                            <option value="CG"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Congo</option>
                            <option value="CD"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Congo, the Democratic Republic of the</option>
                            <option value="CK"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Cook Islands</option>
                            <option value="CR"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Costa Rica</option>
                            <option value="CI"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Côte d'Ivoire</option>
                            <option value="HR"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Croatia</option>
                            <option value="CU"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Cuba</option>
                            <option value="CW"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Curaçao</option>
                            <option value="CY"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Cyprus</option>
                            <option value="CZ"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Czech Republic</option>
                            <option value="DK"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Denmark</option>
                            <option value="DJ"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Djibouti</option>
                            <option value="DM"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Dominica</option>
                            <option value="DO"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Dominican Republic</option>
                            <option value="EC"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Ecuador</option>
                            <option value="EG"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Egypt</option>
                            <option value="SV"  {{$holiday->country_name == old('country_name')? "selected" : null}}>El Salvador</option>
                            <option value="GQ"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Equatorial Guinea</option>
                            <option value="ER"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Eritrea</option>
                            <option value="EE"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Estonia</option>
                            <option value="ET"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Ethiopia</option>
                            <option value="FK"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Falkland Islands (Malvinas)</option>
                            <option value="FO"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Faroe Islands</option>
                            <option value="FJ"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Fiji</option>
                            <option value="FI"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Finland</option>
                            <option value="FR"  {{$holiday->country_name == old('country_name')? "selected" : null}}>France</option>
                            <option value="GF"  {{$holiday->country_name == old('country_name')? "selected" : null}}>French Guiana</option>
                            <option value="PF"  {{$holiday->country_name == old('country_name')? "selected" : null}}>French Polynesia</option>
                            <option value="TF"  {{$holiday->country_name == old('country_name')? "selected" : null}}>French Southern Territories</option>
                            <option value="GA"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Gabon</option>
                            <option value="GM"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Gambia</option>
                            <option value="GE"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Georgia</option>
                            <option value="DE"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Germany</option>
                            <option value="GH"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Ghana</option>
                            <option value="GI"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Gibraltar</option>
                            <option value="GR"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Greece</option>
                            <option value="GL"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Greenland</option>
                            <option value="GD"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Grenada</option>
                            <option value="GP"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Guadeloupe</option>
                            <option value="GU"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Guam</option>
                            <option value="GT"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Guatemala</option>
                            <option value="GG"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Guernsey</option>
                            <option value="GN"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Guinea</option>
                            <option value="GW"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Guinea-Bissau</option>
                            <option value="GY"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Guyana</option>
                            <option value="HT"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Haiti</option>
                            <option value="HM"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Heard Island and McDonald Islands</option>
                            <option value="VA"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Holy See (Vatican City State)</option>
                            <option value="HN"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Honduras</option>
                            <option value="HK"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Hong Kong</option>
                            <option value="HU"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Hungary</option>
                            <option value="IS"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Iceland</option>
                            <option value="IN"  {{$holiday->country_name == old('country_name')? "selected" : null}}>India</option>
                            <option value="ID"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Indonesia</option>
                            <option value="IR"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Iran, Islamic Republic of</option>
                            <option value="IQ"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Iraq</option>
                            <option value="IE"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Ireland</option>
                            <option value="IM"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Isle of Man</option>
                            <option value="IL"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Israel</option>
                            <option value="IT"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Italy</option>
                            <option value="JM"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Jamaica</option>
                            <option value="JP"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Japan</option>
                            <option value="JE"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Jersey</option>
                            <option value="JO"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Jordan</option>
                            <option value="KZ"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Kazakhstan</option>
                            <option value="KE"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Kenya</option>
                            <option value="KI"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Kiribati</option>
                            <option value="KP"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Korea, Democratic People's Republic of</option>
                            <option value="KR"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Korea, Republic of</option>
                            <option value="KW"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Kuwait</option>
                            <option value="KG"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Kyrgyzstan</option>
                            <option value="LA"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Lao People's Democratic Republic</option>
                            <option value="LV"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Latvia</option>
                            <option value="LB"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Lebanon</option>
                            <option value="LS"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Lesotho</option>
                            <option value="LR"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Liberia</option>
                            <option value="LY"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Libya</option>
                            <option value="LI"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Liechtenstein</option>
                            <option value="LT"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Lithuania</option>
                            <option value="LU"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Luxembourg</option>
                            <option value="MO"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Macao</option>
                            <option value="MK"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Macedonia, the former Yugoslav Republic of</option>
                            <option value="MG"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Madagascar</option>
                            <option value="MW"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Malawi</option>
                            <option value="MY"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Malaysia</option>
                            <option value="MV"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Maldives</option>
                            <option value="ML"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Mali</option>
                            <option value="MT"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Malta</option>
                            <option value="MH"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Marshall Islands</option>
                            <option value="MQ"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Martinique</option>
                            <option value="MR"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Mauritania</option>
                            <option value="MU"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Mauritius</option>
                            <option value="YT"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Mayotte</option>
                            <option value="MX"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Mexico</option>
                            <option value="FM"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Micronesia, Federated States of</option>
                            <option value="MD"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Moldova, Republic of</option>
                            <option value="MC"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Monaco</option>
                            <option value="MN"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Mongolia</option>
                            <option value="ME"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Montenegro</option>
                            <option value="MS"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Montserrat</option>
                            <option value="MA"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Morocco</option>
                            <option value="MZ"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Mozambique</option>
                            <option value="MM"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Myanmar</option>
                            <option value="NA"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Namibia</option>
                            <option value="NR"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Nauru</option>
                            <option value="NP"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Nepal</option>
                            <option value="NL"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Netherlands</option>
                            <option value="NC"  {{$holiday->country_name == old('country_name')? "selected" : null}}>New Caledonia</option>
                            <option value="NZ"  {{$holiday->country_name == old('country_name')? "selected" : null}}>New Zealand</option>
                            <option value="NI"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Nicaragua</option>
                            <option value="NE"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Niger</option>
                            <option value="NG"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Nigeria</option>
                            <option value="NU"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Niue</option>
                            <option value="NF"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Norfolk Island</option>
                            <option value="MP"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Northern Mariana Islands</option>
                            <option value="NO"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Norway</option>
                            <option value="OM"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Oman</option>
                            <option value="PK"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Pakistan</option>
                            <option value="PW"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Palau</option>
                            <option value="PS"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Palestinian Territory, Occupied</option>
                            <option value="PA"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Panama</option>
                            <option value="PG"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Papua New Guinea</option>
                            <option value="PY"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Paraguay</option>
                            <option value="PE"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Peru</option>
                            <option value="PH"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Philippines</option>
                            <option value="PN"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Pitcairn</option>
                            <option value="PL"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Poland</option>
                            <option value="PT"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Portugal</option>
                            <option value="PR"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Puerto Rico</option>
                            <option value="QA"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Qatar</option>
                            <option value="RE"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Réunion</option>
                            <option value="RO"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Romania</option>
                            <option value="RU"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Russian Federation</option>
                            <option value="RW"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Rwanda</option>
                            <option value="BL"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Saint Barthélemy</option>
                            <option value="SH"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Saint Helena, Ascension and Tristan da Cunha</option>
                            <option value="KN"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Saint Kitts and Nevis</option>
                            <option value="LC"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Saint Lucia</option>
                            <option value="MF"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Saint Martin (French part)</option>
                            <option value="PM"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Saint Pierre and Miquelon</option>
                            <option value="VC"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Saint Vincent and the Grenadines</option>
                            <option value="WS"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Samoa</option>
                            <option value="SM"  {{$holiday->country_name == old('country_name')? "selected" : null}}>San Marino</option>
                            <option value="ST"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Sao Tome and Principe</option>
                            <option value="SA"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Saudi Arabia</option>
                            <option value="SN"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Senegal</option>
                            <option value="RS"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Serbia</option>
                            <option value="SC"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Seychelles</option>
                            <option value="SL"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Sierra Leone</option>
                            <option value="SG"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Singapore</option>
                            <option value="SX"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Sint Maarten (Dutch part)</option>
                            <option value="SK"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Slovakia</option>
                            <option value="SI"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Slovenia</option>
                            <option value="SB"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Solomon Islands</option>
                            <option value="SO"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Somalia</option>
                            <option value="ZA"  {{$holiday->country_name == old('country_name')? "selected" : null}}>South Africa</option>
                            <option value="GS"  {{$holiday->country_name == old('country_name')? "selected" : null}}>South Georgia and the South Sandwich Islands</option>
                            <option value="SS"  {{$holiday->country_name == old('country_name')? "selected" : null}}>South Sudan</option>
                            <option value="ES"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Spain</option>
                            <option value="LK"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Sri Lanka</option>
                            <option value="SD"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Sudan</option>
                            <option value="SR"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Suriname</option>
                            <option value="SJ"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Svalbard and Jan Mayen</option>
                            <option value="SZ"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Swaziland</option>
                            <option value="SE"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Sweden</option>
                            <option value="CH"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Switzerland</option>
                            <option value="SY"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Syrian Arab Republic</option>
                            <option value="TW"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Taiwan, Province of China</option>
                            <option value="TJ"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Tajikistan</option>
                            <option value="TZ"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Tanzania, United Republic of</option>
                            <option value="TH"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Thailand</option>
                            <option value="TL"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Timor-Leste</option>
                            <option value="TG"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Togo</option>
                            <option value="TK"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Tokelau</option>
                            <option value="TO"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Tonga</option>
                            <option value="TT"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Trinidad and Tobago</option>
                            <option value="TN"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Tunisia</option>
                            <option value="TR"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Turkey</option>
                            <option value="TM"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Turkmenistan</option>
                            <option value="TC"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Turks and Caicos Islands</option>
                            <option value="TV"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Tuvalu</option>
                            <option value="UG"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Uganda</option>
                            <option value="UA"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Ukraine</option>
                            <option value="AE"  {{$holiday->country_name == old('country_name')? "selected" : null}}>United Arab Emirates</option>
                            <option value="GB"  {{$holiday->country_name == old('country_name')? "selected" : null}}>United Kingdom</option>
                            <option value="US"  {{$holiday->country_name == old('country_name')? "selected" : null}}>United States</option>
                            <option value="UM"  {{$holiday->country_name == old('country_name')? "selected" : null}}>United States Minor Outlying Islands</option>
                            <option value="UY"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Uruguay</option>
                            <option value="UZ"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Uzbekistan</option>
                            <option value="VU"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Vanuatu</option>
                            <option value="VE"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Venezuela, Bolivarian Republic of</option>
                            <option value="VN"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Viet Nam</option>
                            <option value="VG"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Virgin Islands, British</option>
                            <option value="VI"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Virgin Islands, U.S.</option>
                            <option value="WF"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Wallis and Futuna</option>
                            <option value="EH"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Western Sahara</option>
                            <option value="YE"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Yemen</option>
                            <option value="ZM"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Zambia</option>
                            <option value="ZW"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Zimbabwe</option>
                        </select>
                        @error('country_name')
                        <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                        @enderror
                    </div>

                    <div class="form-group">
                        <label for="">Holiday Date</label>
                        <input type="date" name="holiday_date" id="holiday_date" value="{{old('holiday_date',$holiday->holiday_date)}}" class="form-control">
                        @error('holiday_date')
                        <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                        @enderror
                    </div>
                    <div class="row ml-0 mr-0">
                        <div class="col-12 text-right">
                            <button class="btn btn-primary">Save</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
