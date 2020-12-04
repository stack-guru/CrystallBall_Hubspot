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
                        <select class="form-control" name="country_name"  >
                            <option value="Afghanistan"  {{$holiday->country_name == "Afghanistan"? "selected" : null}}>Afghanistan</option>
                            <option value="Åland Islands"  {{$holiday->country_name == "Åland Islands"? "selected" : null}}>Åland Islands</option>
                            <option value="Albania"  {{$holiday->country_name == "Albania"? "selected" : null}}>Albania</option>
                            <option value="Algeria"  {{$holiday->country_name == "Algeria"? "selected" : null}}>Algeria</option>
                            <option value="American Samoa"  {{$holiday->country_name == "American Samoa"? "selected" : null}}>American Samoa</option>
                            <option value="Andorra"  {{$holiday->country_name == "Andorra"? "selected" : null}}>Andorra</option>
                            <option value="Angola"  {{$holiday->country_name == "Angola"? "selected" : null}}>Angola</option>
                            <option value="Anguilla"  {{$holiday->country_name == "Anguilla"? "selected" : null}}>Anguilla</option>
                            <option value="Antarctica"  {{$holiday->country_name == "Antarctica"? "selected" : null}}>Antarctica</option>
                            <option value="Antigua and Barbuda"  {{$holiday->country_name == "Antigua and Barbuda"? "selected" : null}}>Antigua and Barbuda</option>
                            <option value="Argentina"  {{$holiday->country_name == "Argentina"? "selected" : null}}>Argentina</option>
                            <option value="Armenia"  {{$holiday->country_name == "Armenia"? "selected" : null}}>Armenia</option>
                            <option value="Aruba"  {{$holiday->country_name == "Aruba"? "selected" : null}}>Aruba</option>
                            <option value="Australia"  {{$holiday->country_name == "Australia"? "selected" : null}}>Australia</option>
                            <option value="Austria"  {{$holiday->country_name == "Austria"? "selected" : null}}>Austria</option>
                            <option value="Azerbaijan"  {{$holiday->country_name == "Azerbaijan"? "selected" : null}}>Azerbaijan</option>
                            <option value="Bahamas"  {{$holiday->country_name == "Bahamas"? "selected" : null}}>Bahamas</option>
                            <option value="Bahrain"  {{$holiday->country_name == "Bahrain"? "selected" : null}}>Bahrain</option>
                            <option value="Bangladesh"  {{$holiday->country_name == "Bangladesh"? "selected" : null}}>Bangladesh</option>
                            <option value="Barbados"  {{$holiday->country_name == "Barbados"? "selected" : null}}>Barbados</option>
                            <option value="Belarus"  {{$holiday->country_name == "Belarus"? "selected" : null}}>Belarus</option>
                            <option value="Belgium"  {{$holiday->country_name == "Belgium"? "selected" : null}}>Belgium</option>
                            <option value="Belize"  {{$holiday->country_name == "Belize"? "selected" : null}}>Belize</option>
                            <option value="Benin"  {{$holiday->country_name == "Benin"? "selected" : null}}>Benin</option>
                            <option value="Bermuda"  {{$holiday->country_name == "Bermuda"? "selected" : null}}>Bermuda</option>
                            <option value="Bhutan"  {{$holiday->country_name == "Bhutan"? "selected" : null}}>Bhutan</option>
                            <option value="Bolivia, Plurinational State of"  {{$holiday->country_name == "Bolivia, Plurinational State of"? "selected" : null}}>Bolivia, Plurinational State of</option>
                            <option value="Bonaire, Sint Eustatius and Saba"  {{$holiday->country_name == "Bonaire, Sint Eustatius and Saba"? "selected" : null}}>Bonaire, Sint Eustatius and Saba</option>
                            <option value="Bosnia and Herzegovina"  {{$holiday->country_name == "Bosnia and Herzegovina"? "selected" : null}}>Bosnia and Herzegovina</option>
                            <option value="Botswana"  {{$holiday->country_name == "Botswana"? "selected" : null}}>Botswana</option>
                            <option value="Bouvet Island"  {{$holiday->country_name == "Bouvet Island"? "selected" : null}}>Bouvet Island</option>
                            <option value="Brazil"  {{$holiday->country_name == "Brazil"? "selected" : null}}>Brazil</option>
                            <option value="British Indian Ocean Territory"  {{$holiday->country_name == "British Indian Ocean Territory"? "selected" : null}}>British Indian Ocean Territory</option>
                            <option value="Brunei Darussalam"  {{$holiday->country_name == "Brunei Darussalam"? "selected" : null}}>Brunei Darussalam</option>
                            <option value="Bulgaria"  {{$holiday->country_name == "Bulgaria"? "selected" : null}}>Bulgaria</option>
                            <option value="Burkina Faso"  {{$holiday->country_name == "Burkina Faso"? "selected" : null}}>Burkina Faso</option>
                            <option value="Burundi"  {{$holiday->country_name == "Burundi"? "selected" : null}}>Burundi</option>
                            <option value="Cambodia"  {{$holiday->country_name == "Cambodia"? "selected" : null}}>Cambodia</option>
                            <option value="Cameroon"  {{$holiday->country_name == "Cameroon"? "selected" : null}}>Cameroon</option>
                            <option value="Canada"  {{$holiday->country_name == "Canada"? "selected" : null}}>Canada</option>
                            <option value="Cape Verde"  {{$holiday->country_name == "Cape Verde"? "selected" : null}}>Cape Verde</option>
                            <option value="Cayman Islands"  {{$holiday->country_name == "Cayman Islands"? "selected" : null}}>Cayman Islands</option>
                            <option value="Central African Republic"  {{$holiday->country_name == "Central African Republic"? "selected" : null}}>Central African Republic</option>
                            <option value="Chad"  {{$holiday->country_name == "Chad"? "selected" : null}}>Chad</option>
                            <option value="Chile"  {{$holiday->country_name == "Chile"? "selected" : null}}>Chile</option>
                            <option value="China"  {{$holiday->country_name == "China"? "selected" : null}}>China</option>
                            <option value="Christmas Island"  {{$holiday->country_name == "Christmas Island"? "selected" : null}}>Christmas Island</option>
                            <option value="Cocos (Keeling) Islands"  {{$holiday->country_name == "Cocos (Keeling) Islands"? "selected" : null}}>Cocos (Keeling) Islands</option>
                            <option value="Colombia"  {{$holiday->country_name == "Colombia"? "selected" : null}}>Colombia</option>
                            <option value="Comoros"  {{$holiday->country_name == "Comoros"? "selected" : null}}>Comoros</option>
                            <option value="Congo"  {{$holiday->country_name == "Congo"? "selected" : null}}>Congo</option>
                            <option value="Congo, the Democratic Republic of the"  {{$holiday->country_name == "Congo, the Democratic Republic of the"? "selected" : null}}>Congo, the Democratic Republic of the</option>
                            <option value="Cook Islands"  {{$holiday->country_name == "Cook Islands"? "selected" : null}}>Cook Islands</option>
                            <option value="Costa Rica"  {{$holiday->country_name == "Costa Rica"? "selected" : null}}>Costa Rica</option>
                            <option value="Côte d'Ivoire"  {{$holiday->country_name == "Côte d'Ivoire"? "selected" : null}}>Côte d'Ivoire</option>
                            <option value="Croatia"  {{$holiday->country_name == "Croatia"? "selected" : null}}>Croatia</option>
                            <option value="Cuba"  {{$holiday->country_name == "Cuba"? "selected" : null}}>Cuba</option>
                            <option value="Curaçao"  {{$holiday->country_name == "Curaçao"? "selected" : null}}>Curaçao</option>
                            <option value="Cyprus"  {{$holiday->country_name == "Cyprus"? "selected" : null}}>Cyprus</option>
                            <option value="Czech Republic"  {{$holiday->country_name == "Czech Republic"? "selected" : null}}>Czech Republic</option>
                            <option value="Denmark"  {{$holiday->country_name == "Denmark"? "selected" : null}}>Denmark</option>
                            <option value="Djibouti"  {{$holiday->country_name == "Djibouti"? "selected" : null}}>Djibouti</option>
                            <option value="Dominica"  {{$holiday->country_name == "Dominica"? "selected" : null}}>Dominica</option>
                            <option value="Dominican Republic"  {{$holiday->country_name == "Dominican Republic"? "selected" : null}}>Dominican Republic</option>
                            <option value="Ecuador"  {{$holiday->country_name == "Ecuador"? "selected" : null}}>Ecuador</option>
                            <option value="Egypt"  {{$holiday->country_name == "Egypt"? "selected" : null}}>Egypt</option>
                            <option value="El Salvador"  {{$holiday->country_name == "El Salvador"? "selected" : null}}>El Salvador</option>
                            <option value="Equatorial Guinea"  {{$holiday->country_name == "Equatorial Guinea"? "selected" : null}}>Equatorial Guinea</option>
                            <option value="Eritrea"  {{$holiday->country_name == "Eritrea"? "selected" : null}}>Eritrea</option>
                            <option value="Estonia"  {{$holiday->country_name =="Estonia"? "selected" : null}}>Estonia</option>
                            <option value="Ethiopia"  {{$holiday->country_name == "Ethiopia"? "selected" : null}}>Ethiopia</option>
                            <option value="Falkland Islands (Malvinas)"  {{$holiday->country_name == "Falkland Islands (Malvinas)"? "selected" : null}}>Falkland Islands (Malvinas)</option>
                            <option value="Faroe Islands"  {{$holiday->country_name == "Faroe Islands"? "selected" : null}}>Faroe Islands</option>
                            <option value="Fiji"  {{$holiday->country_name == "Fiji"? "selected" : null}}>Fiji</option>
                            <option value="Finland"  {{$holiday->country_name == "Finland"? "selected" : null}}>Finland</option>
                            <option value="France"  {{$holiday->country_name == "France"? "selected" : null}}>France</option>
                            <option value="French Guiana"  {{$holiday->country_name == "French Guiana"? "selected" : null}}>French Guiana</option>
                            <option value="French Polynesia"  {{$holiday->country_name == "French Polynesia"? "selected" : null}}>French Polynesia</option>
                            <option value="French Southern Territories"  {{$holiday->country_name == "French Southern Territories"? "selected" : null}}>French Southern Territories</option>
                            <option value="Gabon"  {{$holiday->country_name =="Gabon"? "selected" : null}}>Gabon</option>
                            <option value="Gambia"  {{$holiday->country_name == "Gambia"? "selected" : null}}>Gambia</option>
                            <option value="Georgia"  {{$holiday->country_name == "Georgia"? "selected" : null}}>Georgia</option>
                            <option value="Germany"  {{$holiday->country_name == "Germany"? "selected" : null}}>Germany</option>
                            <option value="Ghana"  {{$holiday->country_name == "Ghana"? "selected" : null}}>Ghana</option>
                            <option value="Gibraltar"  {{$holiday->country_name =="Gibraltar"? "selected" : null}}>Gibraltar</option>
                            <option value="Greece"  {{$holiday->country_name == "Greece"? "selected" : null}}>Greece</option>
                            <option value="Greenland"  {{$holiday->country_name == "Greenland"? "selected" : null}}>Greenland</option>
                            <option value="Grenada"  {{$holiday->country_name == "Grenada"? "selected" : null}}>Grenada</option>
                            <option value="Guadeloupe"  {{$holiday->country_name == "Guadeloupe"? "selected" : null}}>Guadeloupe</option>
                            <option value="Guam"  {{$holiday->country_name == "Guam"? "selected" : null}}>Guam</option>
                            <option value="Guatemala"  {{$holiday->country_name == "Guatemala"? "selected" : null}}>Guatemala</option>
                            <option value="Guernsey"  {{$holiday->country_name == "Guernsey"? "selected" : null}}>Guernsey</option>
                            <option value="Guinea"  {{$holiday->country_name == "Guinea"? "selected" : null}}>Guinea</option>
                            <option value="Guinea-Bissau"  {{$holiday->country_name == "Guinea-Bissau"? "selected" : null}}>Guinea-Bissau</option>
                            <option value="Guyana"  {{$holiday->country_name == "Guyana"? "selected" : null}}>Guyana</option>
                            <option value="Haiti"  {{$holiday->country_name == "Haiti"? "selected" : null}}>Haiti</option>
                            <option value="Heard Island and McDonald Islands"  {{$holiday->country_name =="Heard Island and McDonald Islands"? "selected" : null}}>Heard Island and McDonald Islands</option>
                            <option value="Holy See (Vatican City State)"  {{$holiday->country_name == "Holy See (Vatican City State)"? "selected" : null}}>Holy See (Vatican City State)</option>
                            <option value="Honduras"  {{$holiday->country_name == "Honduras"? "selected" : null}}>Honduras</option>
                            <option value="Hong Kong"  {{$holiday->country_name == "Hong Kong"? "selected" : null}}>Hong Kong</option>
                            <option value="Hungary"  {{$holiday->country_name == "Hungary"? "selected" : null}}>Hungary</option>
                            <option value="Iceland"  {{$holiday->country_name == "Iceland"? "selected" : null}}>Iceland</option>
                            <option value="India"  {{$holiday->country_name == "India"? "selected" : null}}>India</option>
                            <option value="Indonesia"  {{$holiday->country_name == "Indonesia"? "selected" : null}}>Indonesia</option>
                            <option value="Iran, Islamic Republic of"  {{$holiday->country_name == "Iran, Islamic Republic of"? "selected" : null}}>Iran, Islamic Republic of</option>
                            <option value="Iraq"  {{$holiday->country_name == "Iraq"? "selected" : null}}>Iraq</option>
                            <option value="Ireland"  {{$holiday->country_name == "Ireland"? "selected" : null}}>Ireland</option>
                            <option value="Isle of Man"  {{$holiday->country_name == "Isle of Man"? "selected" : null}}>Isle of Man</option>
                            <option value="Israel"  {{$holiday->country_name == "Israel"? "selected" : null}}>Israel</option>
                            <option value="Italy"  {{$holiday->country_name == "Italy"? "selected" : null}}>Italy</option>
                            <option value="Jamaica"  {{$holiday->country_name =="Jamaica"? "selected" : null}}>Jamaica</option>
                            <option value="Japan"  {{$holiday->country_name =="Japan"? "selected" : null}}>Japan</option>
                            <option value="Jersey"  {{$holiday->country_name == "Jersey"? "selected" : null}}>Jersey</option>
                            <option value="Jordan"  {{$holiday->country_name == "Jordan"? "selected" : null}}>Jordan</option>
                            <option value="Kazakhstan"  {{$holiday->country_name == "Kazakhstan"? "selected" : null}}>Kazakhstan</option>
                            <option value="Kenya"  {{$holiday->country_name == "Kenya"? "selected" : null}}>Kenya</option>
                            <option value="Kiribati"  {{$holiday->country_name == "Kiribati"? "selected" : null}}>Kiribati</option>
                            <option value="Korea, Democratic People's Republic of"  {{$holiday->country_name == "Korea, Democratic People's Republic of"? "selected" : null}}>Korea, Democratic People's Republic of</option>
                            <option value="Korea, Republic of"  {{$holiday->country_name == "Korea, Republic of"? "selected" : null}}>Korea, Republic of</option>
                            <option value="Kuwait"  {{$holiday->country_name == "Kuwait"? "selected" : null}}>Kuwait</option>
                            <option value="Kyrgyzstan"  {{$holiday->country_name == "Kyrgyzstan"? "selected" : null}}>Kyrgyzstan</option>
                            <option value="Lao People's Democratic Republic"  {{$holiday->country_name == "Lao People's Democratic Republic"? "selected" : null}}>Lao People's Democratic Republic</option>
                            <option value="Latvia"  {{$holiday->country_name == "Latvia"? "selected" : null}}>Latvia</option>
                            <option value="Lebanon"  {{$holiday->country_name == "Lebanon"? "selected" : null}}>Lebanon</option>
                            <option value="Lesotho"  {{$holiday->country_name == "Lesotho"? "selected" : null}}>Lesotho</option>
                            <option value="Liberia"  {{$holiday->country_name == "Liberia"? "selected" : null}}>Liberia</option>
                            <option value="Libya"  {{$holiday->country_name == "Libya"? "selected" : null}}>Libya</option>
                            <option value="Liechtenstein"  {{$holiday->country_name == "Liechtenstein"? "selected" : null}}>Liechtenstein</option>
                            <option value="Lithuania"  {{$holiday->country_name == "Lithuania"? "selected" : null}}>Lithuania</option>
                            <option value="Luxembourg"  {{$holiday->country_name == "Luxembourg"? "selected" : null}}>Luxembourg</option>
                            <option value="Macao"  {{$holiday->country_name == "Macao"? "selected" : null}}>Macao</option>
                            <option value="Macedonia, the former Yugoslav Republic of"  {{$holiday->country_name =="Macedonia, the former Yugoslav Republic of"? "selected" : null}}>Macedonia, the former Yugoslav Republic of</option>
                            <option value="Madagascar"  {{$holiday->country_name == "Madagascar"? "selected" : null}}>Madagascar</option>
                            <option value="Malawi"  {{$holiday->country_name =="Malawi"? "selected" : null}}>Malawi</option>
                            <option value="Malaysia"  {{$holiday->country_name == "Malaysia"? "selected" : null}}>Malaysia</option>
                            <option value="Maldives"  {{$holiday->country_name == "Maldives"? "selected" : null}}>Maldives</option>
                            <option value="Mali"  {{$holiday->country_name == "Mali"? "selected" : null}}>Mali</option>
                            <option value="Malta"  {{$holiday->country_name == "Malta"? "selected" : null}}>Malta</option>
                            <option value="Marshall Islands"  {{$holiday->country_name == "Marshall Islands"? "selected" : null}}>Marshall Islands</option>
                            <option value="Martinique"  {{$holiday->country_name == "Martinique"? "selected" : null}}>Martinique</option>
                            <option value="Mauritania"  {{$holiday->country_name == "Mauritania"? "selected" : null}}>Mauritania</option>
                            <option value="Mauritius"  {{$holiday->country_name == "Mauritius"? "selected" : null}}>Mauritius</option>
                            <option value="Mayotte"  {{$holiday->country_name == "Mayotte"? "selected" : null}}>Mayotte</option>
                            <option value="Mexico"  {{$holiday->country_name == "Mexico"? "selected" : null}}>Mexico</option>
                            <option value="Micronesia, Federated States of"  {{$holiday->country_name == "Micronesia, Federated States of"? "selected" : null}}>Micronesia, Federated States of</option>
                            <option value="Moldova, Republic of"  {{$holiday->country_name == "Moldova, Republic of"? "selected" : null}}>Moldova, Republic of</option>
                            <option value="Monaco"  {{$holiday->country_name == "Monaco"? "selected" : null}}>Monaco</option>
                            <option value="Mongolia"  {{$holiday->country_name == "Mongolia"? "selected" : null}}>Mongolia</option>
                            <option value="Montenegro"  {{$holiday->country_name == "Montenegro"? "selected" : null}}>Montenegro</option>
                            <option value="Montserrat"  {{$holiday->country_name == "Montserrat"? "selected" : null}}>Montserrat</option>
                            <option value="Morocco"  {{$holiday->country_name == "Morocco"? "selected" : null}}>Morocco</option>
                            <option value="Mozambique"  {{$holiday->country_name == "Mozambique"? "selected" : null}}>Mozambique</option>
                            <option value="Myanmar"  {{$holiday->country_name == "Myanmar"? "selected" : null}}>Myanmar</option>
                            <option value="Namibia"  {{$holiday->country_name =="Namibia"? "selected" : null}}>Namibia</option>
                            <option value="Nauru"  {{$holiday->country_name == "Nauru"? "selected" : null}}>Nauru</option>
                            <option value="Nepal"  {{$holiday->country_name == "Nepal"? "selected" : null}}>Nepal</option>
                            <option value="Netherlands"  {{$holiday->country_name =="Netherlands"? "selected" : null}}>Netherlands</option>
                            <option value="New Caledonia"  {{$holiday->country_name == "New Caledonia"? "selected" : null}}>New Caledonia</option>
                            <option value="New Zealand"  {{$holiday->country_name =="New Zealand"? "selected" : null}}>New Zealand</option>
                            <option value="Nicaragua"  {{$holiday->country_name == "Nicaragua"? "selected" : null}}>Nicaragua</option>
                            <option value="Niger"  {{$holiday->country_name == "Niger"? "selected" : null}}>Niger</option>
                            <option value="Nigeria"  {{$holiday->country_name == "Nigeria"? "selected" : null}}>Nigeria</option>
                            <option value="Niue"  {{$holiday->country_name == "Niue"? "selected" : null}}>Niue</option>
                            <option value="Norfolk Island"  {{$holiday->country_name ==" Norfolk Island"? "selected" : null}}>Norfolk Island</option>
                            <option value="Northern Mariana Islands"  {{$holiday->country_name == "Northern Mariana Islands"? "selected" : null}}>Northern Mariana Islands</option>
                            <option value="Norway"  {{$holiday->country_name == "Norway"? "selected" : null}}>Norway</option>
                            <option value="Oman"  {{$holiday->country_name == "Oman"? "selected" : null}}>Oman</option>
                            <option value="Pakistan"  {{$holiday->country_name == "Pakistan"? "selected" : null}}>Pakistan</option>
                            <option value="Palau"  {{$holiday->country_name == "Palau"? "selected" : null}}>Palau</option>
                            <option value="Palestinian Territory, Occupied"  {{$holiday->country_name == "Palestinian Territory, Occupied"? "selected" : null}}>Palestinian Territory, Occupied</option>
                            <option value="Panama"  {{$holiday->country_name == "Panama"? "selected" : null}}>Panama</option>
                            <option value="Papua New Guinea"  {{$holiday->country_name == "Papua New Guinea"? "selected" : null}}>Papua New Guinea</option>
                            <option value="Paraguay"  {{$holiday->country_name == "Paraguay"? "selected" : null}}>Paraguay</option>
                            <option value="Peru"  {{$holiday->country_name == "Peru"? "selected" : null}}>Peru</option>
                            <option value="Philippines"  {{$holiday->country_name == "Philippines"? "selected" : null}}>Philippines</option>
                            <option value="Pitcairn"  {{$holiday->country_name == "Pitcairn"? "selected" : null}}>Pitcairn</option>
                            <option value="Poland"  {{$holiday->country_name == "Poland"? "selected" : null}}>Poland</option>
                            <option value="Portugal"  {{$holiday->country_name == "Portugal"? "selected" : null}}>Portugal</option>
                            <option value="Puerto Rico"  {{$holiday->country_name == "Puerto Rico"? "selected" : null}}>Puerto Rico</option>
                            <option value="Qatar"  {{$holiday->country_name == "Qatar"? "selected" : null}}>Qatar</option>
                            <option value="Réunion"  {{$holiday->country_name == "Réunion"? "selected" : null}}>Réunion</option>
                            <option value="Romania"  {{$holiday->country_name == "Romania"? "selected" : null}}>Romania</option>
                            <option value="Russian Federation"  {{$holiday->country_name == "Russian Federation"? "selected" : null}}>Russian Federation</option>
                            <option value="Rwanda"  {{$holiday->country_name == "Rwanda"? "selected" : null}}>Rwanda</option>
                            <option value="Saint Barthélemy"  {{$holiday->country_name == "Saint Barthélemy"? "selected" : null}}>Saint Barthélemy</option>
                            <option value="Saint Helena, Ascension and Tristan da Cunha"  {{$holiday->country_name == "Saint Helena, Ascension and Tristan da Cunha"? "selected" : null}}>Saint Helena, Ascension and Tristan da Cunha</option>
                            <option value="Saint Kitts and Nevis"  {{$holiday->country_name == "Saint Kitts and Nevis"? "selected" : null}}>Saint Kitts and Nevis</option>
                            <option value="Saint Lucia"  {{$holiday->country_name == "Saint Lucia"? "selected" : null}}>Saint Lucia</option>
                            <option value="Saint Martin (French part)"  {{$holiday->country_name == "Saint Martin (French part)"? "selected" : null}}>Saint Martin (French part)</option>
                            <option value="Saint Pierre and Miquelon"  {{$holiday->country_name == "Saint Pierre and Miquelon"? "selected" : null}}>Saint Pierre and Miquelon</option>
                            <option value="Saint Vincent and the Grenadines"  {{$holiday->country_name == "Saint Vincent and the Grenadines"? "selected" : null}}>Saint Vincent and the Grenadines</option>
                            <option value="Samoa"  {{$holiday->country_name == "Samoa"? "selected" : null}}>Samoa</option>
                            <option value="San Marino"  {{$holiday->country_name == "San Marino"? "selected" : null}}>San Marino</option>
                            <option value="Sao Tome and Principe"  {{$holiday->country_name == "Sao Tome and Principe"? "selected" : null}}>Sao Tome and Principe</option>
                            <option value="Saudi Arabia"  {{$holiday->country_name == "Saudi Arabia"? "selected" : null}}>Saudi Arabia</option>
                            <option value="Senegal"  {{$holiday->country_name == "Senegal"? "selected" : null}}>Senegal</option>
                            <option value="Serbia"  {{$holiday->country_name == "Serbia"? "selected" : null}}>Serbia</option>
                            <option value="Seychelles"  {{$holiday->country_name == "Seychelles"? "selected" : null}}>Seychelles</option>
                            <option value="Sierra Leone"  {{$holiday->country_name == "Sierra Leone"? "selected" : null}}>Sierra Leone</option>
                            <option value="Singapore"  {{$holiday->country_name == "Singapore"? "selected" : null}}>Singapore</option>
                            <option value="Sint Maarten (Dutch part)"  {{$holiday->country_name == "Sint Maarten (Dutch part)"? "selected" : null}}>Sint Maarten (Dutch part)</option>
                            <option value="Slovakia"  {{$holiday->country_name == "Slovakia"? "selected" : null}}>Slovakia</option>
                            <option value="Slovenia"  {{$holiday->country_name == "Slovenia"? "selected" : null}}>Slovenia</option>
                            <option value="Solomon Islands"  {{$holiday->country_name == "Solomon Islands"? "selected" : null}}>Solomon Islands</option>
                            <option value="Somalia"  {{$holiday->country_name == "Somalia"? "selected" : null}}>Somalia</option>
                            <option value="South Africa"  {{$holiday->country_name == "South Africa"? "selected" : null}}>South Africa</option>
                            <option value="South Georgia and the South Sandwich Islands"  {{$holiday->country_name == "South Georgia and the South Sandwich Islands"? "selected" : null}}>South Georgia and the South Sandwich Islands</option>
                            <option value="South Sudan"  {{$holiday->country_name == "South Sudan"? "selected" : null}}>South Sudan</option>
                            <option value="Spain"  {{$holiday->country_name == "Spain"? "selected" : null}}>Spain</option>
                            <option value="Sri Lanka"  {{$holiday->country_name == "Sri Lanka"? "selected" : null}}>Sri Lanka</option>
                            <option value="Sudan"  {{$holiday->country_name == "Sudan"? "selected" : null}}>Sudan</option>
                            <option value="Suriname"  {{$holiday->country_name == "Suriname"? "selected" : null}}>Suriname</option>
                            <option value="Svalbard and Jan Mayen"  {{$holiday->country_name =="Svalbard and Jan Mayen"? "selected" : null}}>Svalbard and Jan Mayen</option>
                            <option value="Swaziland"  {{$holiday->country_name == "Swaziland"? "selected" : null}}>Swaziland</option>
                            <option value="Sweden"  {{$holiday->country_name == "Sweden"? "selected" : null}}>Sweden</option>
                            <option value="Switzerland"  {{$holiday->country_name == "Switzerland"? "selected" : null}}>Switzerland</option>
                            <option value="Syrian Arab Republic"  {{$holiday->country_name == "Syrian Arab Republic"? "selected" : null}}>Syrian Arab Republic</option>
                            <option value="Taiwan, Province of China"  {{$holiday->country_name == "Taiwan, Province of China"? "selected" : null}}>Taiwan, Province of China</option>
                            <option value="Tajikistan"  {{$holiday->country_name == "Tajikistan"? "selected" : null}}>Tajikistan</option>
                            <option value="Tanzania, United Republic of"  {{$holiday->country_name == "Tanzania, United Republic of"? "selected" : null}}>Tanzania, United Republic of</option>
                            <option value="Thailand"  {{$holiday->country_name == "Thailand"? "selected" : null}}>Thailand</option>
                            <option value="Timor-Leste"  {{$holiday->country_name == "Timor-Leste"? "selected" : null}}>Timor-Leste</option>
                            <option value="Togo"  {{$holiday->country_name == "Togo"? "selected" : null}}>Togo</option>
                            <option value="Tokelau"  {{$holiday->country_name == "Tokelau"? "selected" : null}}>Tokelau</option>
                            <option value="Tonga"  {{$holiday->country_name == "Tonga"? "selected" : null}}>Tonga</option>
                            <option value="Trinidad and Tobago"  {{$holiday->country_name == "Trinidad and Tobago"? "selected" : null}}>Trinidad and Tobago</option>
                            <option value="Tunisia"  {{$holiday->country_name == "Tunisia"? "selected" : null}}>Tunisia</option>
                            <option value="Turkey"  {{$holiday->country_name == "Turkey"? "selected" : null}}>Turkey</option>
                            <option value="Turkmenistan"  {{$holiday->country_name == "Turkmenistan"? "selected" : null}}>Turkmenistan</option>
                            <option value="Turks and Caicos Islands"  {{$holiday->country_name =="Turks and Caicos Islands"? "selected" : null}}>Turks and Caicos Islands</option>
                            <option value="Tuvalu"  {{$holiday->country_name == "Tuvalu"? "selected" : null}}>Tuvalu</option>
                            <option value="Uganda"  {{$holiday->country_name == "Uganda"? "selected" : null}}>Uganda</option>
                            <option value="Ukraine"  {{$holiday->country_name == "Ukraine"? "selected" : null}}>Ukraine</option>
                            <option value="United Arab Emirates"  {{$holiday->country_name =="United Arab Emirates"? "selected" : null}}>United Arab Emirates</option>
                            <option value="United Kingdom"  {{$holiday->country_name == "United Kingdom"? "selected" : null}}>United Kingdom</option>
                            <option value="United States"  {{$holiday->country_name == "United States"? "selected" : null}}>United States</option>
                            <option value="United States Minor Outlying Islands"  {{$holiday->country_name =="United States Minor Outlying Islands"? "selected" : null}}>United States Minor Outlying Islands</option>
                            <option value="Uruguay"  {{$holiday->country_name == "Uruguay"? "selected" : null}}>Uruguay</option>
                            <option value="Uzbekistan"  {{$holiday->country_name == "Uzbekistan"? "selected" : null}}>Uzbekistan</option>
                            <option value="Vanuatu"  {{$holiday->country_name == "Vanuatu"? "selected" : null}}>Vanuatu</option>
                            <option value="Venezuela, Bolivarian Republic of"  {{$holiday->country_name == "Venezuela, Bolivarian Republic of"? "selected" : null}}>Venezuela, Bolivarian Republic of</option>
                            <option value="Viet Nam"  {{$holiday->country_name == "Viet Nam"? "selected" : null}}>Viet Nam</option>
                            <option value="Virgin Islands, British"  {{$holiday->country_name == "Virgin Islands, British"? "selected" : null}}>Virgin Islands, British</option>
                            <option value="Virgin Islands, U.S."  {{$holiday->country_name == "Virgin Islands, U.S."? "selected" : null}}>Virgin Islands, U.S.</option>
                            <option value="Wallis and Futuna"  {{$holiday->country_name == "Wallis and Futuna"? "selected" : null}}>Wallis and Futuna</option>
                            <option value="Western Sahara"  {{$holiday->country_name == "Western Sahara"? "selected" : null}}>Western Sahara</option>
                            <option value="Yemen"  {{$holiday->country_name == "Yemen"? "selected" : null}}>Yemen</option>
                            <option value="Zambia"  {{$holiday->country_name == "Zambia"? "selected" : null}}>Zambia</option>
                            <option value="Zimbabwe"  {{$holiday->country_name == old('country_name')? "selected" : null}}>Zimbabwe</option>
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
