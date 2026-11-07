// Official 28 States and 8 Union Territories of India with major districts and cities

export interface StateLocation {
  state: string;
  type: 'State' | 'Union Territory';
  districts: {
    name: string;
    cities: string[];
  }[];
}

export const INDIA_LOCATIONS: StateLocation[] = [
  {
    state: 'Andhra Pradesh',
    type: 'State',
    districts: [
      { name: 'NTR / Krishna', cities: ['Vijayawada', 'Machilipatnam', 'Gudivada', 'Jaggayyapeta', 'Nuzvid'] },
      { name: 'Guntur', cities: ['Guntur', 'Tenali', 'Mangalagiri', 'Ponnur'] },
      { name: 'Visakhapatnam', cities: ['Visakhapatnam', 'Anakapalle', 'Bheemunipatnam', 'Gajuwaka'] },
      { name: 'Tirupati', cities: ['Tirupati', 'Srikalahasti', 'Gudur', 'Venkatagiri'] },
      { name: 'Kurnool', cities: ['Kurnool', 'Adoni', 'Yemmiganur'] },
      { name: 'East Godavari', cities: ['Rajamahendravaram', 'Kakinada', 'Amalapuram', 'Rajahmundry'] },
      { name: 'Nellore', cities: ['Nellore', 'Kavali', 'Atmakur'] },
      { name: 'Anantapur', cities: ['Anantapur', 'Dharmavaram', 'Guntakal', 'Tadipatri'] },
      { name: 'Kadapa (YSR)', cities: ['Kadapa', 'Proddatur', 'Rayachoti', 'Pulivendula'] },
      { name: 'Chittoor', cities: ['Chittoor', 'Palamaner', 'Nagari', 'Kuppam'] },
    ],
  },
  {
    state: 'Telangana',
    type: 'State',
    districts: [
      { name: 'Hyderabad', cities: ['Hyderabad', 'Secunderabad', 'Begumpet', 'Somajiguda', 'Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Kukatpally'] },
      { name: 'Ranga Reddy', cities: ['LB Nagar', 'Rajendranagar', 'Shamshabad', 'Serilingampally'] },
      { name: 'Medchal-Malkajgiri', cities: ['Malkajgiri', 'Kompally', 'Uppal', 'Alwal'] },
      { name: 'Warangal', cities: ['Warangal', 'Hanamkonda', 'Kazipet'] },
      { name: 'Karimnagar', cities: ['Karimnagar', 'Jagtial', 'Sircilla', 'Huzurabad'] },
      { name: 'Nizamabad', cities: ['Nizamabad', 'Bodhan', 'Armoor', 'Kamareddy'] },
      { name: 'Khammam', cities: ['Khammam', 'Kothagudem', 'Palwancha', 'Madhira'] },
      { name: 'Mahbubnagar', cities: ['Mahbubnagar', 'Jadcherla', 'Gadwal', 'Wanaparthy'] },
      { name: 'Nalgonda', cities: ['Nalgonda', 'Miryalaguda', 'Suryapet', 'Bhubanagiri'] },
    ],
  },
  {
    state: 'Karnataka',
    type: 'State',
    districts: [
      { name: 'Bengaluru Urban', cities: ['Bengaluru', 'Whitefield', 'Indiranagar', 'Jayanagar', 'Koramangala', 'Yelahanka', 'Electronic City'] },
      { name: 'Mysuru', cities: ['Mysuru', 'Nanjangud', 'Hunsur'] },
      { name: 'Dakshina Kannada', cities: ['Mangaluru', 'Bantwal', 'Puttur', 'Sulya'] },
      { name: 'Dharwad', cities: ['Hubballi', 'Dharwad', 'Navalgund'] },
      { name: 'Belagavi', cities: ['Belagavi', 'Gokak', 'Chikkodi'] },
      { name: 'Kalaburagi', cities: ['Kalaburagi', 'Sedam', 'Aland'] },
      { name: 'Ballari', cities: ['Ballari', 'Hosapete', 'Siruguppa'] },
      { name: 'Davanagere', cities: ['Davanagere', 'Harihar'] },
      { name: 'Shivamogga', cities: ['Shivamogga', 'Bhadravati', 'Sagar'] },
      { name: 'Udupi', cities: ['Udupi', 'Kundapura', 'Karkala', 'Manipal'] },
    ],
  },
  {
    state: 'Maharashtra',
    type: 'State',
    districts: [
      { name: 'Mumbai City & Suburban', cities: ['Mumbai', 'Andheri', 'Bandra', 'Borivali', 'Dadar', 'Kurla', 'Colaba'] },
      { name: 'Pune', cities: ['Pune', 'Pimpri-Chinchwad', 'Baramati', 'Lonavala', 'Hinjewadi'] },
      { name: 'Thane', cities: ['Thane', 'Kalyan', 'Dombivli', 'Ulhasnagar', 'Mira-Bhayandar', 'Navi Mumbai'] },
      { name: 'Nagpur', cities: ['Nagpur', 'Kamthi', 'Umred', 'Katol'] },
      { name: 'Nashik', cities: ['Nashik', 'Malegaon', 'Sinnar', 'Deolali'] },
      { name: 'Chhatrapati Sambhajinagar (Aurangabad)', cities: ['Aurangabad', 'Jalna', 'Paithan'] },
      { name: 'Solapur', cities: ['Solapur', 'Pandharpur', 'Barshi'] },
      { name: 'Kolhapur', cities: ['Kolhapur', 'Ichalkaranji', 'Jaysingpur'] },
    ],
  },
  {
    state: 'Delhi (NCT)',
    type: 'Union Territory',
    districts: [
      { name: 'Central Delhi', cities: ['Connaught Place', 'Karol Bagh', 'Daryaganj'] },
      { name: 'New Delhi', cities: ['Chanakyapuri', 'Vasant Kunj', 'Barakhamba'] },
      { name: 'South Delhi', cities: ['Saket', 'Hauz Khas', 'Greater Kailash', 'Lajpat Nagar', 'AIIMS Campus'] },
      { name: 'North Delhi', cities: ['Civil Lines', 'Rohini', 'Pitampura', 'Model Town'] },
      { name: 'West Delhi', cities: ['Janakpuri', 'Rajouri Garden', 'Punjabi Bagh', 'Dwarka'] },
      { name: 'East Delhi', cities: ['Preet Vihar', 'Mayur Vihar', 'Laxmi Nagar'] },
    ],
  },
  {
    state: 'Tamil Nadu',
    type: 'State',
    districts: [
      { name: 'Chennai', cities: ['Chennai', 'Adyar', 'Anna Nagar', 'T. Nagar', 'Velachery', 'Guindy'] },
      { name: 'Coimbatore', cities: ['Coimbatore', 'Pollachi', 'Mettupalayam'] },
      { name: 'Madurai', cities: ['Madurai', 'Melur', 'Thirumangalam'] },
      { name: 'Tiruchirappalli', cities: ['Tiruchirappalli', 'Srirangam', 'Manapparai'] },
      { name: 'Salem', cities: ['Salem', 'Attur', 'Mettur'] },
      { name: 'Tirunelveli', cities: ['Tirunelveli', 'Palayamkottai', 'Ambasamudram'] },
    ],
  },
  {
    state: 'Kerala',
    type: 'State',
    districts: [
      { name: 'Thiruvananthapuram', cities: ['Thiruvananthapuram', 'Neyyattinkara', 'Attingal', 'Nedumangad'] },
      { name: 'Ernakulam', cities: ['Kochi', 'Ernakulam', 'Aluva', 'Angamaly', 'Kakkanad'] },
      { name: 'Kozhikode', cities: ['Kozhikode', 'Vadakara', 'Koyilandy'] },
      { name: 'Thrissur', cities: ['Thrissur', 'Chalakudy', 'Guruvayur', 'Kodungallur'] },
      { name: 'Kollam', cities: ['Kollam', 'Karunagappally', 'Paravur'] },
    ],
  },
  {
    state: 'Gujarat',
    type: 'State',
    districts: [
      { name: 'Ahmedabad', cities: ['Ahmedabad', 'Sanand', 'Dholka', 'Bopal', 'SG Highway'] },
      { name: 'Surat', cities: ['Surat', 'Bardoli', 'Navsari'] },
      { name: 'Vadodara', cities: ['Vadodara', 'Padra', 'Dabhoi'] },
      { name: 'Rajkot', cities: ['Rajkot', 'Morbi', 'Gondal'] },
      { name: 'Gandhinagar', cities: ['Gandhinagar', 'Kalol', 'Mansa'] },
    ],
  },
  {
    state: 'West Bengal',
    type: 'State',
    districts: [
      { name: 'Kolkata', cities: ['Kolkata', 'Salt Lake', 'New Town', 'Ballygunge', 'Alipore', 'Park Street'] },
      { name: 'North 24 Parganas', cities: ['Barasat', 'Barrackpore', 'Bidhannagar', 'Dum Dum'] },
      { name: 'Howrah', cities: ['Howrah', 'Bally', 'Uluberia'] },
      { name: 'Darjeeling', cities: ['Siliguri', 'Darjeeling', 'Kurseong'] },
      { name: 'Paschim Bardhaman', cities: ['Asansol', 'Durgapur', 'Raniganj'] },
    ],
  },
  {
    state: 'Rajasthan',
    type: 'State',
    districts: [
      { name: 'Jaipur', cities: ['Jaipur', 'Chomu', 'Sanganer', 'Amer'] },
      { name: 'Jodhpur', cities: ['Jodhpur', 'Bilara', 'Piparcity'] },
      { name: 'Kota', cities: ['Kota', 'Ramganj Mandi'] },
      { name: 'Udaipur', cities: ['Udaipur', 'Fatehnagar', 'Salumbar'] },
      { name: 'Ajmer', cities: ['Ajmer', 'Kishangarh', 'Beawar', 'Pushkar'] },
    ],
  },
  {
    state: 'Uttar Pradesh',
    type: 'State',
    districts: [
      { name: 'Lucknow', cities: ['Lucknow', 'Gomti Nagar', 'Alambagh', 'Indira Nagar'] },
      { name: 'Gautam Buddha Nagar', cities: ['Noida', 'Greater Noida', 'Dadri'] },
      { name: 'Ghaziabad', cities: ['Ghaziabad', 'Indirapuram', 'Sahibabad', 'Modinagar'] },
      { name: 'Kanpur Nagar', cities: ['Kanpur', 'Kalyanpur', 'Kidwai Nagar'] },
      { name: 'Varanasi', cities: ['Varanasi', 'BHU Campus', 'Sarnath', 'Ramnagar'] },
      { name: 'Agra', cities: ['Agra', 'Fatehabad', 'Bah'] },
      { name: 'Prayagraj (Allahabad)', cities: ['Prayagraj', 'Naini', 'Phulpur'] },
      { name: 'Meerut', cities: ['Meerut', 'Sardhana', 'Mawana'] },
    ],
  },
  {
    state: 'Madhya Pradesh',
    type: 'State',
    districts: [
      { name: 'Bhopal', cities: ['Bhopal', 'Berasia', 'Kolar', 'Arera Colony'] },
      { name: 'Indore', cities: ['Indore', 'Mhow', 'Rau', 'Vijay Nagar'] },
      { name: 'Jabalpur', cities: ['Jabalpur', 'Sihora', 'Panagar'] },
      { name: 'Gwalior', cities: ['Gwalior', 'Dabra', 'Morar'] },
    ],
  },
  {
    state: 'Punjab',
    type: 'State',
    districts: [
      { name: 'Ludhiana', cities: ['Ludhiana', 'Khanna', 'Jagraon'] },
      { name: 'Amritsar', cities: ['Amritsar', 'Majitha', 'Ajnala'] },
      { name: 'Jalandhar', cities: ['Jalandhar', 'Phillaur', 'Nakodar'] },
      { name: 'SAS Nagar (Mohali)', cities: ['Mohali', 'Kharar', 'Zirakpur', 'Derabassi'] },
    ],
  },
  {
    state: 'Haryana',
    type: 'State',
    districts: [
      { name: 'Gurugram', cities: ['Gurugram (Gurgaon)', 'Manesar', 'Sohna', 'DLF Phase 1-5'] },
      { name: 'Faridabad', cities: ['Faridabad', 'Ballabhgarh'] },
      { name: 'Panchkula', cities: ['Panchkula', 'Pinjore', 'Kalka'] },
      { name: 'Ambala', cities: ['Ambala', 'Ambala Cantt', 'Barara'] },
      { name: 'Karnal', cities: ['Karnal', 'Gharaunda', 'Taraori'] },
    ],
  },
  {
    state: 'Odisha',
    type: 'State',
    districts: [
      { name: 'Khordha', cities: ['Bhubaneswar', 'Jatni', 'Khordha'] },
      { name: 'Cuttack', cities: ['Cuttack', 'Choudwar', 'Athagarh'] },
      { name: 'Sundargarh', cities: ['Rourkela', 'Sundargarh', 'Rajgangpur'] },
      { name: 'Puri', cities: ['Puri', 'Konark', 'Pipili'] },
    ],
  },
  {
    state: 'Bihar',
    type: 'State',
    districts: [
      { name: 'Patna', cities: ['Patna', 'Danapur', 'Phulwari Sharif', 'Fatwah'] },
      { name: 'Gaya', cities: ['Gaya', 'Bodh Gaya', 'Sherghati'] },
      { name: 'Bhagalpur', cities: ['Bhagalpur', 'Kahalgaon', 'Sultanganj'] },
      { name: 'Muzaffarpur', cities: ['Muzaffarpur', 'Motipur', 'Kanti'] },
    ],
  },
  {
    state: 'Assam',
    type: 'State',
    districts: [
      { name: 'Kamrup Metropolitan', cities: ['Guwahati', 'Dispur', 'North Guwahati'] },
      { name: 'Dibrugarh', cities: ['Dibrugarh', 'Naharkatia', 'Chabua'] },
      { name: 'Cachar', cities: ['Silchar', 'Sonai', 'Lakhipur'] },
      { name: 'Jorhat', cities: ['Jorhat', 'Mariani', 'Titabar'] },
    ],
  },
  {
    state: 'Goa',
    type: 'State',
    districts: [
      { name: 'North Goa', cities: ['Panaji', 'Mapusa', 'Calangute', 'Bicholim'] },
      { name: 'South Goa', cities: ['Margao', 'Vasco da Gama', 'Ponda', 'Curchorem'] },
    ],
  },
  {
    state: 'Chhattisgarh',
    type: 'State',
    districts: [
      { name: 'Raipur', cities: ['Raipur', 'Nava Raipur (Atal Nagar)', 'Birgaon', 'Abhanpur'] },
      { name: 'Durg', cities: ['Bhilai', 'Durg', 'Patan'] },
      { name: 'Bilaspur', cities: ['Bilaspur', 'Ratanpur', 'Kota'] },
    ],
  },
  {
    state: 'Jharkhand',
    type: 'State',
    districts: [
      { name: 'Ranchi', cities: ['Ranchi', 'Kanke', 'Hatia', 'Bundu'] },
      { name: 'East Singhbhum', cities: ['Jamshedpur', 'Ghatshila', 'Musabani'] },
      { name: 'Dhanbad', cities: ['Dhanbad', 'Jharia', 'Katras', 'Sindri'] },
      { name: 'Bokaro', cities: ['Bokaro Steel City', 'Chas', 'Bermo'] },
    ],
  },
  {
    state: 'Uttarakhand',
    type: 'State',
    districts: [
      { name: 'Dehradun', cities: ['Dehradun', 'Rishikesh', 'Mussoorie', 'Vikasnagar'] },
      { name: 'Haridwar', cities: ['Haridwar', 'Roorkee', 'Laksar'] },
      { name: 'Nainital', cities: ['Haldwani', 'Nainital', 'Ramnagar'] },
      { name: 'Udham Singh Nagar', cities: ['Rudrapur', 'Kashipur', 'Kichha'] },
    ],
  },
  {
    state: 'Himachal Pradesh',
    type: 'State',
    districts: [
      { name: 'Shimla', cities: ['Shimla', 'Rampur', 'Theog'] },
      { name: 'Kangra', cities: ['Dharamshala', 'Kangra', 'Palampur'] },
      { name: 'Solan', cities: ['Solan', 'Baddi', 'Nalagarh', 'Kasauli'] },
      { name: 'Mandi', cities: ['Mandi', 'Sundernagar', 'Sarkaghat'] },
    ],
  },
  {
    state: 'Jammu and Kashmir',
    type: 'Union Territory',
    districts: [
      { name: 'Srinagar', cities: ['Srinagar', 'Ganderbal'] },
      { name: 'Jammu', cities: ['Jammu', 'R.S. Pura', 'Akhnoor'] },
      { name: 'Anantnag', cities: ['Anantnag', 'Bijbehara', 'Pahalgam'] },
      { name: 'Udhampur', cities: ['Udhampur', 'Ramnagar', 'Chenani'] },
    ],
  },
  {
    state: 'Chandigarh',
    type: 'Union Territory',
    districts: [
      { name: 'Chandigarh', cities: ['Chandigarh (Sector 1-63)', 'Manimajra'] },
    ],
  },
  {
    state: 'Puducherry',
    type: 'Union Territory',
    districts: [
      { name: 'Puducherry', cities: ['Puducherry (Pondicherry)', 'Ozhukarai'] },
      { name: 'Karaikal', cities: ['Karaikal'] },
    ],
  },
  {
    state: 'Tripura',
    type: 'State',
    districts: [{ name: 'West Tripura', cities: ['Agartala', 'Ranirbazar'] }],
  },
  {
    state: 'Meghalaya',
    type: 'State',
    districts: [{ name: 'East Khasi Hills', cities: ['Shillong', 'Cherrapunji (Sohra)'] }],
  },
  {
    state: 'Manipur',
    type: 'State',
    districts: [{ name: 'Imphal West', cities: ['Imphal', 'Lamphelpat'] }],
  },
  {
    state: 'Nagaland',
    type: 'State',
    districts: [{ name: 'Kohima & Dimapur', cities: ['Kohima', 'Dimapur'] }],
  },
  {
    state: 'Mizoram',
    type: 'State',
    districts: [{ name: 'Aizawl', cities: ['Aizawl'] }],
  },
  {
    state: 'Arunachal Pradesh',
    type: 'State',
    districts: [{ name: 'Papum Pare', cities: ['Itanagar', 'Naharlagun'] }],
  },
  {
    state: 'Sikkim',
    type: 'State',
    districts: [{ name: 'East Sikkim', cities: ['Gangtok', 'Singtam'] }],
  },
  {
    state: 'Ladakh',
    type: 'Union Territory',
    districts: [{ name: 'Leh & Kargil', cities: ['Leh', 'Kargil'] }],
  },
  {
    state: 'Andaman and Nicobar Islands',
    type: 'Union Territory',
    districts: [{ name: 'South Andaman', cities: ['Port Blair'] }],
  },
  {
    state: 'Dadra and Nagar Haveli and Daman and Diu',
    type: 'Union Territory',
    districts: [{ name: 'Daman & Silvassa', cities: ['Daman', 'Silvassa', 'Diu'] }],
  },
  {
    state: 'Lakshadweep',
    type: 'Union Territory',
    districts: [{ name: 'Lakshadweep', cities: ['Kavaratti', 'Agatti'] }],
  },
];

// Helper functions for search & extraction
export function getAllStates(): string[] {
  return INDIA_LOCATIONS.map(l => l.state).sort();
}

export function getDistrictsForState(stateName: string): string[] {
  const match = INDIA_LOCATIONS.find(l => l.state.toLowerCase() === stateName.toLowerCase());
  return match ? match.districts.map(d => d.name).sort() : [];
}

export function getCitiesForDistrictOrState(stateName: string, districtName?: string): string[] {
  const match = INDIA_LOCATIONS.find(l => l.state.toLowerCase() === stateName.toLowerCase());
  if (!match) return [];
  if (districtName && districtName !== 'ALL') {
    const dist = match.districts.find(d => d.name.toLowerCase() === districtName.toLowerCase());
    return dist ? dist.cities : [];
  }
  return match.districts.flatMap(d => d.cities).sort();
}

export function searchCitiesAcrossIndia(query: string): Array<{ city: string; state: string; district: string }> {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().trim();
  const results: Array<{ city: string; state: string; district: string }> = [];

  for (const loc of INDIA_LOCATIONS) {
    for (const dist of loc.districts) {
      for (const city of dist.cities) {
        if (city.toLowerCase().includes(q) || dist.name.toLowerCase().includes(q) || loc.state.toLowerCase().includes(q)) {
          results.push({ city, state: loc.state, district: dist.name });
        }
      }
    }
  }

  return results.slice(0, 20);
}
