export type Language = 'English' | 'Telugu' | 'Hindi';

export interface TranslationDictionary {
  [key: string]: string;
  // Navigation
  nav_home: string;
  nav_find_doctors: string;
  nav_hospitals: string;
  nav_symptom_finder: string;
  nav_specializations: string;
  nav_appointments: string;
  nav_ai_assistant: string;
  nav_queue: string;
  nav_health_records: string;
  nav_revenue: string;
  nav_admin_portal: string;
  nav_signin: string;
  nav_signout: string;
  nav_emergency_helpline: string;
  nav_dial_108: string;

  // Common Actions & Buttons
  btn_back: string;
  btn_home: string;
  btn_dashboard: string;
  btn_search: string;
  btn_clear_filters: string;
  btn_book_appointment: string;
  btn_view_details: string;
  btn_track_queue: string;
  btn_call_emergency: string;
  btn_load_more: string;
  btn_view_all: string;
  btn_save: string;
  btn_cancel: string;
  btn_close: string;
  btn_confirm: string;
  btn_subscribe: string;
  btn_edit_alerts: string;
  btn_view_doctors: string;
  btn_view_map: string;
  btn_contact_hospital: string;

  // Home Page
  hero_title_prefix: string;
  hero_title_highlight: string;
  hero_subtitle: string;
  hero_search_placeholder: string;
  hero_council_badge: string;
  hero_popular_searches: string;
  hero_metrics_verified_doctors: string;
  hero_metrics_hospitals: string;
  hero_metrics_opd_queues: string;
  hero_metrics_multilingual: string;
  hero_symptom_finder_banner_title: string;
  hero_symptom_finder_banner_desc: string;
  hero_symptom_finder_btn: string;

  // Hospital Search Page
  hosp_page_title: string;
  hosp_page_subtitle: string;
  hosp_search_placeholder: string;
  hosp_filter_location: string;
  hosp_filter_specialty: string;
  hosp_filter_emergency_only: string;
  hosp_filter_all_specialties: string;
  hosp_sort_by: string;
  hosp_sort_relevance: string;
  hosp_sort_cost_low: string;
  hosp_sort_cost_high: string;
  hosp_sort_name: string;
  hosp_total_found: string;
  hosp_no_results_title: string;
  hosp_no_results_desc: string;
  hosp_verified_badge: string;
  hosp_pending_badge: string;
  hosp_departments_label: string;
  hosp_facilities_label: string;
  hosp_starting_fee: string;
  hosp_operating_hours: string;
  hosp_emergency_unit: string;
  hosp_view_profile: string;

  // Hospital Details Modal / Page
  hosp_details_overview: string;
  hosp_details_accreditation: string;
  hosp_details_reg_number: string;
  hosp_details_emergency_contact: string;
  hosp_details_general_contact: string;
  hosp_details_address: string;
  hosp_details_doctors_available: string;
  hosp_details_live_queue: string;
  hosp_details_reviews: string;

  // Symptom / Health Concern Finder
  sym_finder_title: string;
  sym_finder_subtitle: string;
  sym_finder_input_label: string;
  sym_finder_input_placeholder: string;
  sym_finder_quick_concerns: string;
  sym_finder_location_label: string;
  sym_finder_distance_label: string;
  sym_finder_distance_any: string;
  sym_finder_distance_5km: string;
  sym_finder_distance_10km: string;
  sym_finder_distance_25km: string;
  sym_finder_distance_50km: string;
  sym_finder_suggested_specialties: string;
  sym_finder_matching_hospitals: string;
  sym_finder_matching_doctors: string;
  sym_finder_compare_facilities: string;
  sym_finder_disclaimer_title: string;
  sym_finder_disclaimer_text: string;
  sym_finder_emergency_warning: string;

  // Doctor Search Page
  doc_page_title: string;
  doc_page_subtitle: string;
  doc_search_placeholder: string;
  doc_not_found: string;
  doc_experience: string;
  doc_consultation_fee: string;
  doc_reg_number: string;
  doc_available_slots: string;

  // Appointments & Booking
  apt_page_title: string;
  apt_page_subtitle: string;
  apt_select_hospital: string;
  apt_select_doctor: string;
  apt_select_date: string;
  apt_select_slot: string;
  apt_patient_name: string;
  apt_patient_phone: string;
  apt_symptoms_reason: string;
  apt_confirm_booking: string;
  apt_booking_success: string;
  apt_booking_ref: string;
  apt_your_opd_token: string;
  apt_reschedule: string;
  apt_cancel: string;
  apt_my_appointments: string;

  // Custom OPD Notification Preferences
  notif_settings_title: string;
  notif_settings_desc: string;
  notif_channel_label: string;
  notif_channel_sms: string;
  notif_channel_push: string;
  notif_channel_both: string;
  notif_channel_none: string;
  notif_timing_label: string;
  notif_timing_30m: string;
  notif_timing_20m: string;
  notif_timing_15m: string;
  notif_timing_10m: string;
  notif_timing_5m: string;
  notif_timing_custom: string;
  notif_custom_minutes_placeholder: string;
  notif_consent_checkbox: string;
  notif_gateway_transparency_note: string;

  // OPD Queue Dashboard
  queue_page_title: string;
  queue_page_subtitle: string;
  queue_now_serving: string;
  queue_your_token: string;
  queue_patients_ahead: string;
  queue_est_wait_time: string;
  queue_select_hospital: string;
  queue_select_session: string;
  queue_staff_controls: string;
  queue_call_next: string;
  queue_mark_delayed: string;
  queue_mark_absent: string;
  queue_mark_completed: string;

  // AI Voice Assistant
  ai_page_title: string;
  ai_page_subtitle: string;
  ai_input_placeholder: string;
  ai_speak_or_type: string;
  ai_listening: string;
  ai_sources_label: string;
  ai_suggested_queries_title: string;
  ai_safety_disclaimer: string;
  ai_clear_chat: string;
  ai_auto_speak: string;

  // Revenue & Pricing
  rev_page_title: string;
  rev_page_subtitle: string;
  rev_ethics_title: string;
  rev_ethics_text: string;
  rev_zero_cut_badge: string;
  rev_monthly_billing: string;
  rev_annual_billing: string;
  rev_save_15: string;
  rev_tab_patient: string;
  rev_tab_doctor: string;
  rev_tab_hospital: string;
  rev_tab_admin: string;
  rev_subscribe_btn: string;

  // Specialization Directory
  spec_page_title: string;
  spec_page_subtitle: string;
  spec_search_placeholder: string;
  spec_find_hospitals_btn: string;
  spec_find_doctors_btn: string;
  spec_common_symptoms: string;

  // Medical Records Vault
  rec_page_title: string;
  rec_page_subtitle: string;
  rec_upload_btn: string;
  rec_family_btn: string;
  rec_dpdp_guarantee: string;

  // Admin Dashboard
  admin_page_title: string;
  admin_page_subtitle: string;
  admin_tab_doctor_audits: string;
  admin_tab_hospital_audits: string;
  admin_tab_live_queues: string;
  admin_tab_sms_gateway: string;
  admin_tab_pricing: string;
  admin_tab_audit_logs: string;
  admin_tab_register_doctor: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  English: {
    nav_home: 'Home',
    nav_find_doctors: 'Find Doctors',
    nav_hospitals: 'Hospitals',
    nav_symptom_finder: 'Symptom & Hospital Finder',
    nav_specializations: 'Specialties',
    nav_appointments: 'Appointments',
    nav_ai_assistant: 'AI Assistant',
    nav_queue: 'OPD Queue',
    nav_health_records: 'Health Records',
    nav_revenue: 'Revenue & Plans',
    nav_admin_portal: 'Admin Portal',
    nav_signin: 'Sign In',
    nav_signout: 'Sign Out',
    nav_emergency_helpline: 'Emergency Helpline:',
    nav_dial_108: 'Dial 108 / 112',

    btn_back: 'Back',
    btn_home: 'Home',
    btn_dashboard: 'Dashboard',
    btn_search: 'Search',
    btn_clear_filters: 'Reset All Filters',
    btn_book_appointment: 'Book Appointment',
    btn_view_details: 'Hospital Profile',
    btn_track_queue: 'Track OPD Queue',
    btn_call_emergency: 'Emergency Call',
    btn_load_more: 'Load More Hospitals',
    btn_view_all: 'View All',
    btn_save: 'Save',
    btn_cancel: 'Cancel',
    btn_close: 'Close',
    btn_confirm: 'Confirm Booking',
    btn_subscribe: 'Subscribe',
    btn_edit_alerts: 'Notification Settings',
    btn_view_doctors: 'View Doctors',
    btn_view_map: 'View Map & Route',
    btn_contact_hospital: 'Contact Hospital',

    hero_title_prefix: 'Healthcare for Everyone,',
    hero_title_highlight: 'Everywhere.',
    hero_subtitle: 'Discover verified healthcare providers, book appointments, and access trusted healthcare services through one intelligent platform.',
    hero_search_placeholder: 'Search hospital name, doctor, or specialty (e.g. Apex Hospital, Rajahmundry, Cardiology)...',
    hero_council_badge: 'State Medical Council & NHA Verified Directory • India Launch Phase 1',
    hero_popular_searches: 'Popular searches:',
    hero_metrics_verified_doctors: 'Council Verified Doctors',
    hero_metrics_hospitals: 'Verified Hospitals Across India',
    hero_metrics_opd_queues: 'Live Digital OPD Queues',
    hero_metrics_multilingual: 'Telugu • Hindi • English',
    hero_symptom_finder_banner_title: 'Unsure which hospital or doctor to visit?',
    hero_symptom_finder_banner_desc: 'Try our Symptom & Health Concern Finder to locate hospitals equipped with the exact clinical departments you need.',
    hero_symptom_finder_btn: 'Find Hospital by Health Concern',

    hosp_page_title: 'Verified Hospitals Across India',
    hosp_page_subtitle: 'Discover accredited healthcare centers, 24x7 trauma wards, intensive care, and real-time OPD queues across every Indian city.',
    hosp_search_placeholder: 'Search by hospital name (e.g. Apex Hospital, KIMS), specialty, facility, PIN code...',
    hosp_filter_location: 'Location (All India)',
    hosp_filter_specialty: 'Specialty / Department',
    hosp_filter_emergency_only: '24x7 Emergency Units Only',
    hosp_filter_all_specialties: 'All Specialties',
    hosp_sort_by: 'Sort By',
    hosp_sort_relevance: 'Relevance',
    hosp_sort_cost_low: 'Consultation Fee: Low to High',
    hosp_sort_cost_high: 'Consultation Fee: High to Low',
    hosp_sort_name: 'Hospital Name (A-Z)',
    hosp_total_found: 'hospitals found',
    hosp_no_results_title: 'No matching hospital found in our verified database',
    hosp_no_results_desc: 'Could not verify a hospital matching your search. Please check the spelling, search by city or district, or explore nearby centers.',
    hosp_verified_badge: 'VERIFIED HEALTHCARE CENTER',
    hosp_pending_badge: 'AUDIT IN PROGRESS',
    hosp_departments_label: 'Clinical Specialties:',
    hosp_facilities_label: 'Facilities & Emergency:',
    hosp_starting_fee: 'Consultation from',
    hosp_operating_hours: 'OPD Hours',
    hosp_emergency_unit: '24x7 Emergency / Trauma',
    hosp_view_profile: 'View Hospital Profile',

    hosp_details_overview: 'Hospital Overview & Accreditation',
    hosp_details_accreditation: 'Accreditations',
    hosp_details_reg_number: 'Registration ID (ROHINI/CEA)',
    hosp_details_emergency_contact: '24x7 Emergency Hotline',
    hosp_details_general_contact: 'Official Reception Phone',
    hosp_details_address: 'Complete Hospital Campus Address',
    hosp_details_doctors_available: 'Practicing Verified Specialists',
    hosp_details_live_queue: 'Live OPD Queue Status',
    hosp_details_reviews: 'Quality & Regulatory Compliance',

    sym_finder_title: 'Find the Right Hospital for Your Health Concern',
    sym_finder_subtitle: 'Enter your symptoms or medical concern to match with specialized departments and verified hospitals near you.',
    sym_finder_input_label: 'Describe your symptom or health concern',
    sym_finder_input_placeholder: 'e.g., Fever, high temperature, chest pain, child cough, severe knee joint ache...',
    sym_finder_quick_concerns: 'Quick Health Concerns:',
    sym_finder_location_label: 'Your City or District',
    sym_finder_distance_label: 'Maximum Distance',
    sym_finder_distance_any: 'Any Distance (City-wide)',
    sym_finder_distance_5km: 'Within 5 km',
    sym_finder_distance_10km: 'Within 10 km',
    sym_finder_distance_25km: 'Within 25 km',
    sym_finder_distance_50km: 'Within 50 km',
    sym_finder_suggested_specialties: 'Recommended Clinical Specialties:',
    sym_finder_matching_hospitals: 'Matching Hospitals with Required Facilities:',
    sym_finder_matching_doctors: 'Specialists Available for Consultation:',
    sym_finder_compare_facilities: 'Compare Hospital Capabilities:',
    sym_finder_disclaimer_title: 'Important Clinical & Safety Disclaimer',
    sym_finder_disclaimer_text: 'This feature is an informational directory guide only and does NOT provide medical diagnosis or prescribe treatment. Always consult a qualified medical doctor for medical advice.',
    sym_finder_emergency_warning: 'RED FLAG EMERGENCY: If you or someone with you experiences severe chest pain, acute breathlessness, sudden speech loss or severe paralysis, do NOT wait for an OPD appointment. Dial 108 or 112 immediately or go to the nearest 24x7 emergency room.',

    doc_page_title: 'Find Verified Doctors Across India',
    doc_page_subtitle: 'Discover medical specialists with state medical council verified registration numbers.',
    doc_search_placeholder: 'Search doctor name, specialization, hospital, registration number...',
    doc_not_found: 'No matching doctor found. Try another name, city, or specialization.',
    doc_experience: 'Experience',
    doc_consultation_fee: 'Consultation Fee',
    doc_reg_number: 'Council Reg #',
    doc_available_slots: 'Available Slots Today',

    apt_page_title: 'Book a Doctor Consultation',
    apt_page_subtitle: 'Direct hospital appointments with zero booking surcharge. Your consultation fee belongs 100% to your doctor.',
    apt_select_hospital: 'Select Hospital or Clinic',
    apt_select_doctor: 'Select Consulting Doctor',
    apt_select_date: 'Select Appointment Date',
    apt_select_slot: 'Select Time Slot',
    apt_patient_name: 'Patient Full Name',
    apt_patient_phone: 'Patient Mobile Number (+91)',
    apt_symptoms_reason: 'Reason for Visit / Symptoms (Optional)',
    apt_confirm_booking: 'Confirm & Generate OPD Token',
    apt_booking_success: 'Appointment Booked Successfully!',
    apt_booking_ref: 'Booking Reference',
    apt_your_opd_token: 'Your Digital OPD Token Number',
    apt_reschedule: 'Reschedule',
    apt_cancel: 'Cancel Appointment',
    apt_my_appointments: 'My Active Consultations',

    notif_settings_title: 'Advance OPD Queue Notifications',
    notif_settings_desc: 'Receive alerts ahead of your OPD turn so you never have to wait in crowded hospital corridors.',
    notif_channel_label: 'Notification Channel',
    notif_channel_sms: 'SMS Message',
    notif_channel_push: 'Push Notification',
    notif_channel_both: 'Both (SMS & Push)',
    notif_channel_none: 'No Notifications (Self-track)',
    notif_timing_label: 'Advance Notice Before Turn',
    notif_timing_30m: '30 Minutes Before',
    notif_timing_20m: '20 Minutes Before',
    notif_timing_15m: '15 Minutes Before',
    notif_timing_10m: '10 Minutes Before',
    notif_timing_5m: '5 Minutes Before',
    notif_timing_custom: 'Custom Alert Time',
    notif_custom_minutes_placeholder: 'Enter minutes (e.g. 25)',
    notif_consent_checkbox: 'I explicitly consent to receive queue and appointment SMS notifications on my mobile phone.',
    notif_gateway_transparency_note: 'Gateway Status: TRAI-DLT compliant templates are dispatched. Real carrier delivery occurs only after gateway activation.',

    queue_page_title: 'Live Hospital OPD Queue Tracker',
    queue_page_subtitle: 'Real-time digital token display. Know exactly when your turn arrives.',
    queue_now_serving: 'Currently Serving Token',
    queue_your_token: 'Your OPD Token Number',
    queue_patients_ahead: 'Patients Ahead of You',
    queue_est_wait_time: 'Estimated Wait Time',
    queue_select_hospital: 'Select Healthcare Center',
    queue_select_session: 'OPD Session',
    queue_staff_controls: 'Staff Desk Controls (OPD Receptionist / Doctor)',
    queue_call_next: 'Call Next Token',
    queue_mark_delayed: 'Patient Delayed',
    queue_mark_absent: 'Mark Absent / Skip',
    queue_mark_completed: 'Mark Completed',

    ai_page_title: 'AI Multilingual Health Guide',
    ai_page_subtitle: 'Voice and text assistant in Telugu, Hindi, and English grounded in actual verified hospital and doctor records.',
    ai_input_placeholder: 'Ask about Apex Hospital, Rajahmundry, fever clinics, KIMS Hyderabad, or OPD tokens...',
    ai_speak_or_type: 'Speak or type your question...',
    ai_listening: 'Listening to your voice... Speak now',
    ai_sources_label: 'Verified Database Sourced Results:',
    ai_suggested_queries_title: 'Suggested Health & Navigation Questions:',
    ai_safety_disclaimer: 'Informational health assistant. Does not diagnose or prescribe medicine. Emergency? Dial 108.',
    ai_clear_chat: 'Clear conversation',
    ai_auto_speak: 'Read answers aloud automatically',

    rev_page_title: 'Platform Software Packages & Pricing',
    rev_page_subtitle: 'Transparent software subscriptions for patients, independent clinics, and multispecialty hospital groups.',
    rev_ethics_title: '0% Doctor Fee Cut Policy & Ethics Charter',
    rev_ethics_text: 'Doctor consultation fees belong 100% to verified healthcare providers. Universal Health Care AI NEVER takes booking surcharges or referral commissions.',
    rev_zero_cut_badge: '0% Doctor Fee Cut Guarantee',
    rev_monthly_billing: 'Monthly Billing',
    rev_annual_billing: 'Annual Billing',
    rev_save_15: 'Save 15%',
    rev_tab_patient: 'Patient Plans',
    rev_tab_doctor: 'Doctor Plans',
    rev_tab_hospital: 'Hospital Plans',
    rev_tab_admin: 'Platform Admin',
    rev_subscribe_btn: 'Subscribe (Sandbox)',

    spec_page_title: 'Medical Specialization Directory',
    spec_page_subtitle: 'Explore 26+ clinical specialties, common health concerns, and find accredited hospitals and doctors.',
    spec_search_placeholder: 'Search specialty (e.g. Cardiology, Pediatrics, Neurology, Orthopedics)...',
    spec_find_hospitals_btn: 'Hospitals with this Department',
    spec_find_doctors_btn: 'Consult Specialists',
    spec_common_symptoms: 'Common Health Concerns Treated:',

    rec_page_title: 'Digital Health Records Vault',
    rec_page_subtitle: 'Encrypted document locker compliant with the Digital Personal Data Protection (DPDP) Act.',
    rec_upload_btn: 'Upload Document',
    rec_family_btn: 'Family Members',
    rec_dpdp_guarantee: 'Patient-exclusive consent. Data is never shared or sold for advertising.',

    admin_page_title: 'Medical Registrar Administration',
    admin_page_subtitle: 'Audit council credentials, manage live queues, inspect SMS gateway, and configure subscription plans.',
    admin_tab_doctor_audits: 'Doctor Audits',
    admin_tab_hospital_audits: 'Hospital Audits',
    admin_tab_live_queues: 'Live Hospital Queues',
    admin_tab_sms_gateway: 'SMS Gateway Diagnostics',
    admin_tab_pricing: 'Subscription Pricing',
    admin_tab_audit_logs: 'Audit & Compliance Logs',
    admin_tab_register_doctor: '+ Register Doctor',
  },

  Telugu: {
    nav_home: 'హోమ్',
    nav_find_doctors: 'వైద్యులను కనుగొనండి',
    nav_hospitals: 'ఆసుపత్రులు',
    nav_symptom_finder: 'లక్షణాలు & ఆసుపత్రి శోధన',
    nav_specializations: 'ప్రత్యేక విభాగాలు',
    nav_appointments: 'అపాయింట్‌మెంట్లు',
    nav_ai_assistant: 'AI అసిస్టెంట్',
    nav_queue: 'OPD క్యూ',
    nav_health_records: 'ఆరోగ్య రికార్డులు',
    nav_revenue: 'ప్లాట్‌ఫారమ్ ప్లాన్లు',
    nav_admin_portal: 'అడ్మిన్ పోర్టల్',
    nav_signin: 'లాగిన్',
    nav_signout: 'లాగ్ అవుట్',
    nav_emergency_helpline: 'అత్యవసర హెల్ప్‌లైన్:',
    nav_dial_108: '108 / 112 కు కాల్ చేయండి',

    btn_back: 'వెనుకకు',
    btn_home: 'హోమ్ పేజీ',
    btn_dashboard: 'డాష్‌బోర్డ్',
    btn_search: 'శోధించండి',
    btn_clear_filters: 'అన్ని ఫిల్టర్లను రీసెట్ చేయండి',
    btn_book_appointment: 'అపాయింట్‌మెంట్ బుక్ చేయండి',
    btn_view_details: 'ఆసుపత్రి వివరాలు',
    btn_track_queue: 'OPD క్యూ చూడండి',
    btn_call_emergency: 'ఎమర్జెన్సీ కాల్',
    btn_load_more: 'మరిన్ని ఆసుపత్రులు చూపించు',
    btn_view_all: 'అన్నీ చూడండి',
    btn_save: 'భద్రపరచు',
    btn_cancel: 'రద్దు చేయి',
    btn_close: 'మూసివేయి',
    btn_confirm: 'బుకింగ్ నిర్ధారించండి',
    btn_subscribe: 'సబ్‌స్క్రయిబ్ చేసుకోండి',
    btn_edit_alerts: 'నోటిఫికేషన్ సెట్టింగ్స్',
    btn_view_doctors: 'వైద్యుల వివరాలు',
    btn_view_map: 'మ్యాప్ & రూట్ చూడండి',
    btn_contact_hospital: 'ఆసుపత్రిని సంప్రదించండి',

    hero_title_prefix: 'అందరికీ ఆరోగ్యం,',
    hero_title_highlight: 'ఎల్లవేళలా, ఎక్కడికైనా.',
    hero_subtitle: 'ధృవీకరించబడిన వైద్యులు, ఆసుపత్రులను కనుగొని, అపాయింట్‌మెంట్లు బుక్ చేసుకుని, నమ్మకమైన ఆరోగ్య సేవలను ఒకే చోట పొందండి.',
    hero_search_placeholder: 'ఆసుపత్రి పేరు (ఉదా: Apex Hospital, Rajahmundry, KIMS), వైద్యుడు లేదా స్పెషలైజేషన్...',
    hero_council_badge: 'స్టేట్ మెడికల్ కౌన్సిల్ & NHA ద్వారా ధృవీకరించబడిన డైరెక్టరీ • భారతదేశం',
    hero_popular_searches: 'ప్రముఖ శోధనలు:',
    hero_metrics_verified_doctors: 'కౌన్సిల్ వెరిఫైడ్ వైద్యులు',
    hero_metrics_hospitals: 'భారతదేశం అంతటా ఆసుపత్రులు',
    hero_metrics_opd_queues: 'లైవ్ డిజిటల్ OPD క్యూలు',
    hero_metrics_multilingual: 'తెలుగు • హిందీ • ఇంగ్లీష్',
    hero_symptom_finder_banner_title: 'మీ ఆరోగ్య సమస్యకు ఏ ఆసుపత్రికి వెళ్లాలో తెలియడం లేదా?',
    hero_symptom_finder_banner_desc: 'మా లక్షణాలు & ఆరోగ్య సమస్యల శోధన ద్వారా మీకు అవసరమైన క్లినికల్ విభాగం ఉన్న ఆసుపత్రిని సులభంగా కనుగొనండి.',
    hero_symptom_finder_btn: 'ఆరోగ్య సమస్య ఆధారంగా ఆసుపత్రిని కనుగొనండి',

    hosp_page_title: 'భారతదేశం అంతటా ధృవీకరించబడిన ఆసుపత్రులు',
    hosp_page_subtitle: 'ప్రతి నగరంలో గుర్తింపు పొందిన ఆసుపత్రులు, 24 గంటల ఎమర్జెన్సీ విభాగాలు, ICU మరియు లైవ్ OPD క్యూలు.',
    hosp_search_placeholder: 'ఆసుపత్రి పేరు (Apex Hospital, KIMS), స్పెషాలిటీ, సౌకర్యాలు, పిన్ కోడ్ టైప్ చేయండి...',
    hosp_filter_location: 'ప్రాంతం (భారతదేశం అంతటా)',
    hosp_filter_specialty: 'వైద్య విభాగం / స్పెషాలిటీ',
    hosp_filter_emergency_only: '24x7 అత్యవసర విభాగాలు మాత్రమే',
    hosp_filter_all_specialties: 'అన్ని విభాగాలు',
    hosp_sort_by: 'క్రమబద్ధీకరించు',
    hosp_sort_relevance: 'ప్రాముఖ్యత ఆధారంగా',
    hosp_sort_cost_low: 'ఫీజు: తక్కువ నుండి ఎక్కువ',
    hosp_sort_cost_high: 'ఫీజు: ఎక్కువ నుండి తక్కువ',
    hosp_sort_name: 'ఆసుపత్రి పేరు (A-Z)',
    hosp_total_found: 'ఆసుపత్రులు అందుబాటులో ఉన్నాయి',
    hosp_no_results_title: 'ధృవీకరించబడిన డేటాబేస్‌లో సరిపోలే ఆసుపత్రి కనుగొనబడలేదు',
    hosp_no_results_desc: 'మీ శోధనకు సరిపోయే ఆసుపత్రి నమోదు కాలేదు. స్పెల్లింగ్ సరిచూడండి లేదా నగరం / ప్రత్యేకత ద్వారా వెతకండి.',
    hosp_verified_badge: 'ధృవీకరించబడిన ఆరోగ్య కేంద్రం',
    hosp_pending_badge: 'ఆడిట్ పరిశీలనలో ఉంది',
    hosp_departments_label: 'క్లినికల్ విభాగాలు:',
    hosp_facilities_label: 'సౌకర్యాలు & ఎమర్జెన్సీ:',
    hosp_starting_fee: 'కన్సల్టేషన్ ప్రారంభ రుసుము',
    hosp_operating_hours: 'OPD సమయాలు',
    hosp_emergency_unit: '24x7 ఎమర్జెన్సీ / ట్రామా కేర్',
    hosp_view_profile: 'ఆసుపత్రి పూర్తి వివరాలు',

    hosp_details_overview: 'ఆసుపత్రి వివరాలు & గుర్తింపు',
    hosp_details_accreditation: 'అక్రిడిటేషన్లు (NABH/NABL)',
    hosp_details_reg_number: 'రిజిస్ట్రేషన్ ID (ROHINI/CEA)',
    hosp_details_emergency_contact: '24x7 ఎమర్జెన్సీ నంబర్',
    hosp_details_general_contact: 'రిసెప్షన్ ఫోన్ నంబర్',
    hosp_details_address: 'ఆసుపత్రి చిరునామా',
    hosp_details_doctors_available: 'అందుబాటులో ఉన్న వైద్యులు',
    hosp_details_live_queue: 'లైవ్ OPD క్యూ స్థితి',
    hosp_details_reviews: 'నాణ్యత & నియంత్రణ ప్రమాణాలు',

    sym_finder_title: 'మీ ఆరోగ్య సమస్యకు సరైన ఆసుపత్రిని కనుగొనండి',
    sym_finder_subtitle: 'మీ లక్షణాలు లేదా ఆరోగ్య సమస్యను నమోదు చేసి సరైన విభాగాలు మరియు సమీపంలోని ఆసుపత్రులను కనుగొనండి.',
    sym_finder_input_label: 'మీ లక్షణం లేదా సమస్యను నమోదు చేయండి',
    sym_finder_input_placeholder: 'ఉదా: జ్వరం, ఛాతీ నొప్పి, పిల్లలకు జలుబు/దగ్గు, కీళ్ల నొప్పులు, కడుపు నొప్పి...',
    sym_finder_quick_concerns: 'సాధారణ ఆరోగ్య సమస్యలు:',
    sym_finder_location_label: 'మీ నగరం లేదా జిల్లా',
    sym_finder_distance_label: 'గరిష్ట దూరం',
    sym_finder_distance_any: 'ఏ దూరమైనా (నగరం అంతటా)',
    sym_finder_distance_5km: '5 కి.మీ పరిధిలో',
    sym_finder_distance_10km: '10 కి.మీ పరిధిలో',
    sym_finder_distance_25km: '25 కి.మీ పరిధిలో',
    sym_finder_distance_50km: '50 కి.మీ పరిధిలో',
    sym_finder_suggested_specialties: 'సిఫార్సు చేయబడిన వైద్య విభాగాలు:',
    sym_finder_matching_hospitals: 'సరైన సౌకర్యాలు కలిగిన ఆసుపత్రులు:',
    sym_finder_matching_doctors: 'అందుబాటులో ఉన్న నిపుణులైన వైద్యులు:',
    sym_finder_compare_facilities: 'ఆసుపత్రి సౌకర్యాల పోలిక:',
    sym_finder_disclaimer_title: 'ముఖ్యమైన క్లినికల్ & భద్రతా హెచ్చరిక',
    sym_finder_disclaimer_text: 'ఇది కేవలం సమాచార మార్గదర్శి మాత్రమే. ఇది ఎలాంటి వైద్య నిర్ధారణ లేదా ఔషధాలను సూచించదు. ఎల్లప్పుడూ అర్హత కలిగిన వైద్యుడిని సంప్రదించండి.',
    sym_finder_emergency_warning: 'అత్యవసర హెచ్చరిక: తీవ్రమైన ఛాతీ నొప్పి, శ్వాస ఆడకపోవడం, పక్షవాతం లక్షణాలు ఉంటే OPD అపాయింట్‌మెంట్ కోసం వేచి ఉండకండి. వెంటనే 108 లేదా 112 కు కాల్ చేయండి లేదా ఎమర్జెన్సీ వార్డుకు వెళ్లండి.',

    doc_page_title: 'భారతదేశంలోని ధృవీకరించబడిన వైద్యులు',
    doc_page_subtitle: 'స్టేట్ మెడికల్ కౌన్సిల్ ద్వారా రిజిస్ట్రేషన్ వెరిఫై చేయబడిన ప్రముఖ స్పెషలిస్టులు.',
    doc_search_placeholder: 'డాక్టర్ పేరు, స్పెషాలిటీ, ఆసుపత్రి, రిజిస్ట్రేషన్ నంబర్...',
    doc_not_found: 'సరిపోలే డాక్టర్ కనుగొనబడలేదు. మరొక పేరు, నగరం లేదా స్పెషలైజేషన్ ప్రయత్నించండి.',
    doc_experience: 'అనుభవం',
    doc_consultation_fee: 'సంప్రదింపు రుసుము',
    doc_reg_number: 'కౌన్సిల్ రిజిస్ట్రేషన్ #',
    doc_available_slots: 'నేడు అందుబాటులో ఉన్న సమయాలు',

    apt_page_title: 'వైద్యుని అపాయింట్‌మెంట్ బుక్ చేయండి',
    apt_page_subtitle: 'నేరుగా ఆసుపత్రి అపాయింట్‌మెంట్లు — జీరో ప్లాట్‌ఫారమ్ కమీషన్. మీ కన్సల్టేషన్ ఫీజు 100% మీ డాక్టర్‌కే చేరుతుంది.',
    apt_select_hospital: 'ఆసుపత్రి లేదా క్లినిక్ ఎంచుకోండి',
    apt_select_doctor: 'వైద్యుడిని ఎంచుకోండి',
    apt_select_date: 'తేదీ ఎంచుకోండి',
    apt_select_slot: 'సమయాన్ని ఎంచుకోండి',
    apt_patient_name: 'రోగి పూర్తి పేరు',
    apt_patient_phone: 'మొబైల్ నంబర్ (+91)',
    apt_symptoms_reason: 'సమస్య లేదా లక్షణాలు (ఐచ్ఛికం)',
    apt_confirm_booking: 'నిర్ధారించి OPD టోకెన్ పొందండి',
    apt_booking_success: 'అపాయింట్‌మెంట్ విజయవంతంగా బుక్ చేయబడింది!',
    apt_booking_ref: 'బుకింగ్ రిఫరెన్స్ ఐడీ',
    apt_your_opd_token: 'మీ డిజిటల్ OPD టోకెన్ నంబర్',
    apt_reschedule: 'సమయం మార్చండి',
    apt_cancel: 'అపాయింట్‌మెంట్ రద్దు చేయండి',
    apt_my_appointments: 'నా అపాయింట్‌మెంట్లు',

    notif_settings_title: 'ముందస్తు OPD క్యూ నోటిఫికేషన్లు',
    notif_settings_desc: 'మీ టోకెన్ సమయానికి ముందే హెచ్చరికలు అందుకోండి. రద్దీగా ఉండే హాల్స్‌లో గంటల తరబడి వేచి ఉండాల్సిన అవసరం లేదు.',
    notif_channel_label: 'నోటిఫికేషన్ మార్గం',
    notif_channel_sms: 'SMS మెసేజ్',
    notif_channel_push: 'యాప్ పుష్ నోటిఫికేషన్',
    notif_channel_both: 'రెండూ (SMS & పుష్)',
    notif_channel_none: 'నోటిఫికేషన్లు వద్దు',
    notif_timing_label: 'ఎంత సమయం ముందు సమాచారం కావాలి?',
    notif_timing_30m: '30 నిమిషాల ముందు',
    notif_timing_20m: '20 నిమిషాల ముందు',
    notif_timing_15m: '15 నిమిషాల ముందు',
    notif_timing_10m: '10 నిమిషాల ముందు',
    notif_timing_5m: '5 నిమిషాల ముందు',
    notif_timing_custom: 'ప్రత్యేక సమయం (కస్టమ్)',
    notif_custom_minutes_placeholder: 'నిమిషాలు నమోదు చేయండి (ఉదా: 25)',
    notif_consent_checkbox: 'నా మొబైల్ నంబర్‌కు క్యూ మరియు అపాయింట్‌మెంట్ SMS నోటిఫికేషన్లు రావడానికి నేను స్పష్టంగా అంగీకరిస్తున్నాను.',
    notif_gateway_transparency_note: 'టెలికాం గేట్‌వే స్థితి: TRAI DLT నిబంధనల ప్రకారం టెంప్లేట్ సమర్పించబడింది. నిజమైన క్యారియర్ డెలివరీ యాక్టివ్ గేట్‌వే ద్వారా మాత్రమే జరుగుతుంది.',

    queue_page_title: 'లైవ్ ఆసుపత్రి OPD క్యూ ట్రాకర్',
    queue_page_subtitle: 'రియల్-టైమ్ డిజిటల్ టోకెన్ డిస్ప్లే. మీ వంతు ఎప్పుడు వస్తుందో ఖచ్చితంగా తెలుసుకోండి.',
    queue_now_serving: 'ప్రస్తుతం పరిశీలిస్తున్న టోకెన్',
    queue_your_token: 'మీ OPD టోకెన్ నంబర్',
    queue_patients_ahead: 'మీ కంటే ముందున్న రోగులు',
    queue_est_wait_time: 'అంచనా వేసిన వేచి ఉండే సమయం',
    queue_select_hospital: 'ఆసుపత్రిని ఎంచుకోండి',
    queue_select_session: 'OPD సెషన్',
    queue_staff_controls: 'సిబ్బంది డెస్క్ నియంత్రణలు (రిసెప్షనిస్ట్ / డాక్టర్)',
    queue_call_next: 'తదుపరి టోకెన్ పిలవండి',
    queue_mark_delayed: 'రోగి ఆలస్యం అయ్యారు',
    queue_mark_absent: 'రోగి రాలేదు / స్కిప్ చేయి',
    queue_mark_completed: 'ముగిసిందిగా గుర్తించండి',

    ai_page_title: 'AI బహుభాషా ఆరోగ్య సహాయకుడు',
    ai_page_subtitle: 'ధృవీకరించబడిన ఆసుపత్రులు, వైద్యుల సమాచారంతో పనిచేసే తెలుగు, హిందీ, ఇంగ్లీష్ వాయిస్ అసిస్టెంట్.',
    ai_input_placeholder: 'Apex Hospital, రాజమండ్రి, జ్వరం క్లినిక్లు, KIMS హైదరాబాద్, OPD టోకెన్ల గురించి అడగండి...',
    ai_speak_or_type: 'మాట్లాడండి లేదా టైప్ చేయండి...',
    ai_listening: 'వాయిస్ వింటున్నాను... ఇప్పుడు మాట్లాడండి',
    ai_sources_label: 'ధృవీకరించబడిన డేటాబేస్ మూలాలు:',
    ai_suggested_queries_title: 'సూచించబడిన ఆరోగ్య & నావిగేషన్ ప్రశ్నలు:',
    ai_safety_disclaimer: 'సమాచార సహాయకుడు మాత్రమే. ఔషధాలు లేదా వైద్య చికిత్స సూచించదు. అత్యవసరమైతే 108 కు కాల్ చేయండి.',
    ai_clear_chat: 'సంభాషణను క్లియర్ చేయండి',
    ai_auto_speak: 'సమాధానాలను ఆటోమేటిక్‌గా చదివి వినిపించు',

    rev_page_title: 'ప్లాట్‌ఫారమ్ సాఫ్ట్‌వేర్ ప్యాకేజీలు & ధరలు',
    rev_page_subtitle: 'రోగులు, వైద్యులు మరియు ఆసుపత్రుల కోసం పారదర్శకమైన సాఫ్ట్‌వేర్ సబ్‌స్క్రిప్షన్ ప్యాకేజీలు.',
    rev_ethics_title: '0% డాక్టర్ ఫీజు కట్ విధానం & నైతిక చార్టర్',
    rev_ethics_text: 'రోగి చెల్లించే కన్సల్టేషన్ ఫీజు 100% వైద్యులకే చెందుతుంది. Universal Health Care AI ఎలాంటి కమీషన్ తీసుకోదు.',
    rev_zero_cut_badge: '0% డాక్టర్ ఫీజు కట్ గ్యారెంటీ',
    rev_monthly_billing: 'నెలవారీ బిల్లింగ్',
    rev_annual_billing: 'వార్షిక బిల్లింగ్',
    rev_save_15: '15% ఆదా చేసుకోండి',
    rev_tab_patient: 'రోగి ప్లాన్లు',
    rev_tab_doctor: 'వైద్యుల ప్లాన్లు',
    rev_tab_hospital: 'ఆసుపత్రి ప్లాన్లు',
    rev_tab_admin: 'అడ్మినిస్ట్రేటర్ వ్యూ',
    rev_subscribe_btn: 'సబ్‌స్క్రయిబ్ చేయండి (శాండ్‌బాక్స్)',

    spec_page_title: 'వైద్య ప్రత్యేక విభాగాల డైరెక్టరీ',
    spec_page_subtitle: '26 కి పైగా వైద్య విభాగాలు, సంబంధిత లక్షణాలు మరియు గుర్తింపు పొందిన ఆసుపత్రులను తెలుసుకోండి.',
    spec_search_placeholder: 'స్పెషాలిటీ శోధించండి (ఉదా: కార్డియాలజీ, పీడియాట్రిక్స్, న్యూరాలజీ, ఆర్థోపెడిక్స్)...',
    spec_find_hospitals_btn: 'ఈ విభాగం కలిగిన ఆసుపత్రులు',
    spec_find_doctors_btn: 'స్పెషలిస్టులను సంప్రదించండి',
    spec_common_symptoms: 'చికిత్స అందించే సాధారణ సమస్యలు:',

    rec_page_title: 'డిజిటల్ హెల్త్ రికార్డ్స్ వాల్ట్',
    rec_page_subtitle: 'డిజిటల్ వ్యక్తిగత డేటా రక్షణ చట్టం (DPDP Act) కి అనుగుణంగా ఎన్‌క్రిప్ట్ చేయబడిన లాకర్.',
    rec_upload_btn: 'పత్రం అప్‌లోడ్ చేయండి',
    rec_family_btn: 'కుటుంబ సభ్యుల ప్రొఫైల్స్',
    rec_dpdp_guarantee: 'రోగి అనుమతితో మాత్రమే యాక్సెస్. మీ డేటా ఎవరికీ విక్రయించబడదు.',

    admin_page_title: 'మెడికల్ రిజిస్ట్రార్ పరిపాలన',
    admin_page_subtitle: 'మెడికల్ కౌన్సిల్ క్రెడెన్షియల్స్ ఆడిట్, లైవ్ క్యూ నిర్వహణ, SMS గేట్‌వే మరియు ప్లాన్ల నిర్వహణ.',
    admin_tab_doctor_audits: 'వైద్యుల ఆడిట్స్',
    admin_tab_hospital_audits: 'ఆసుపత్రుల ఆడిట్స్',
    admin_tab_live_queues: 'లైవ్ ఆసుపత్రి క్యూలు',
    admin_tab_sms_gateway: 'SMS గేట్‌వే స్థితి',
    admin_tab_pricing: 'సబ్‌స్క్రిప్షన్ ధరలు',
    admin_tab_audit_logs: 'ఆడిట్ & భద్రతా లాగ్‌లు',
    admin_tab_register_doctor: '+ నూతన డాక్టర్‌ను నమోదు చేయండి',
  },

  Hindi: {
    nav_home: 'होम',
    nav_find_doctors: 'डॉक्टर खोजें',
    nav_hospitals: 'अस्पताल',
    nav_symptom_finder: 'लक्षण व अस्पताल खोजक',
    nav_specializations: 'विशेषज्ञताएं',
    nav_appointments: 'अपॉइंटमेंट्स',
    nav_ai_assistant: 'AI असिस्टेंट',
    nav_queue: 'ओपीडी कतार',
    nav_health_records: 'स्वास्थ्य रिकॉर्ड',
    nav_revenue: 'योजनाएं व शुल्क',
    nav_admin_portal: 'व्यवस्थापक पोर्टल',
    nav_signin: 'साइन इन',
    nav_signout: 'साइन आउट',
    nav_emergency_helpline: 'आपातकालीन हेल्पलाइन:',
    nav_dial_108: '108 / 112 डायल करें',

    btn_back: 'पीछे जाएं',
    btn_home: 'होम',
    btn_dashboard: 'डैशबोर्ड',
    btn_search: 'खोजें',
    btn_clear_filters: 'फ़िल्टर हटाएं',
    btn_book_appointment: 'अपॉइंटमेंट बुक करें',
    btn_view_details: 'अस्पताल प्रोफ़ाइल',
    btn_track_queue: 'ओपीडी कतार ट्रैक करें',
    btn_call_emergency: 'आपातकालीन कॉल',
    btn_load_more: 'और अस्पताल देखें',
    btn_view_all: 'सभी देखें',
    btn_save: 'सुरक्षित करें',
    btn_cancel: 'रद्द करें',
    btn_close: 'बंद करें',
    btn_confirm: 'बुकिंग की पुष्टि करें',
    btn_subscribe: 'सब्सक्राइब करें',
    btn_edit_alerts: 'सूचना सेटिंग्स',
    btn_view_doctors: 'डॉक्टर देखें',
    btn_view_map: 'मानचित्र व दिशा-निर्देश',
    btn_contact_hospital: 'अस्पताल से संपर्क करें',

    hero_title_prefix: 'स्वास्थ्य सेवा सभी के लिए,',
    hero_title_highlight: 'हर समय, हर जगह।',
    hero_subtitle: 'सत्यापित स्वास्थ्य सेवा प्रदाताओं को खोजें, अपॉइंटमेंट बुक करें और एक ही मंच से विश्वसनीय सेवाएं प्राप्त करें।',
    hero_search_placeholder: 'अस्पताल का नाम (जैसे Apex Hospital, Rajahmundry, KIMS), डॉक्टर या विशेषज्ञता...',
    hero_council_badge: 'स्टेट मेडिकल काउंसिल और NHA द्वारा सत्यापित डायरेक्टरी • भारत',
    hero_popular_searches: 'लोकप्रिय खोजें:',
    hero_metrics_verified_doctors: 'काउंसिल सत्यापित डॉक्टर',
    hero_metrics_hospitals: 'सत्यापित अस्पताल नेटवर्क',
    hero_metrics_opd_queues: 'लाइव डिजिटल ओपीडी कतार',
    hero_metrics_multilingual: 'तेलुगु • हिंदी • अंग्रेजी',
    hero_symptom_finder_banner_title: 'समझ नहीं आ रहा किस अस्पताल या डॉक्टर के पास जाएं?',
    hero_symptom_finder_banner_desc: 'हमारे लक्षण और स्वास्थ्य चिंता खोजक का उपयोग करके सही विभागों से सुसज्जित अस्पतालों को खोजें।',
    hero_symptom_finder_btn: 'स्वास्थ्य समस्या द्वारा अस्पताल खोजें',

    hosp_page_title: 'भारत भर में सत्यापित अस्पताल',
    hosp_page_subtitle: 'मान्यता प्राप्त स्वास्थ्य केंद्र, 24x7 ट्रॉमा केयर, गहन चिकित्सा और वास्तविक समय ओपीडी कतारें।',
    hosp_search_placeholder: 'अस्पताल का नाम (जैसे Apex Hospital, KIMS), विभाग, पिन कोड खोजें...',
    hosp_filter_location: 'स्थान (संपूर्ण भारत)',
    hosp_filter_specialty: 'चिकित्सा विभाग / विशेषज्ञता',
    hosp_filter_emergency_only: 'केवल 24x7 आपातकालीन इकाइयाँ',
    hosp_filter_all_specialties: 'सभी विशेषज्ञताएं',
    hosp_sort_by: 'क्रमबद्ध करें',
    hosp_sort_relevance: 'प्रासंगिकता',
    hosp_sort_cost_low: 'परामर्श शुल्क: कम से अधिक',
    hosp_sort_cost_high: 'परामर्श शुल्क: अधिक से कम',
    hosp_sort_name: 'अस्पताल नाम (A-Z)',
    hosp_total_found: 'अस्पताल उपलब्ध हैं',
    hosp_no_results_title: 'सत्यापित डेटाबेस में कोई अस्पताल नहीं मिला',
    hosp_no_results_desc: 'आपकी खोज से मेल खाता कोई अस्पताल सत्यापित नहीं हुआ। वर्तनी की जाँच करें या शहर/विशेषज्ञता बदलें।',
    hosp_verified_badge: 'सत्यापित स्वास्थ्य केंद्र',
    hosp_pending_badge: 'सत्यापन प्रक्रियाधीन',
    hosp_departments_label: 'चिकित्सा विभाग:',
    hosp_facilities_label: 'सुविधाएं व आपातकाल:',
    hosp_starting_fee: 'परामर्श शुल्क न्यूनतम',
    hosp_operating_hours: 'ओपीडी का समय',
    hosp_emergency_unit: '24x7 आपातकालीन व ट्रॉमा केयर',
    hosp_view_profile: 'अस्पताल प्रोफ़ाइल देखें',

    hosp_details_overview: 'अस्पताल विवरण व मान्यता',
    hosp_details_accreditation: 'मान्यता (NABH/NABL)',
    hosp_details_reg_number: 'पंजीकरण संख्या (ROHINI/CEA)',
    hosp_details_emergency_contact: '24x7 आपातकालीन नंबर',
    hosp_details_general_contact: 'रिसेप्शन संपर्क नंबर',
    hosp_details_address: 'अस्पताल परिसर का पूरा पता',
    hosp_details_doctors_available: 'उपलब्ध विशेषज्ञ डॉक्टर',
    hosp_details_live_queue: 'लाइव ओपीडी कतार स्थिति',
    hosp_details_reviews: 'गुणवत्ता व विनियामक अनुपालन',

    sym_finder_title: 'अपनी स्वास्थ्य चिंता के लिए सही अस्पताल खोजें',
    sym_finder_subtitle: 'अपने लक्षण या समस्या दर्ज करें और आवश्यक विभागों से युक्त निकटतम अस्पतालों की सूची प्राप्त करें।',
    sym_finder_input_label: 'अपने लक्षण या स्वास्थ्य चिंता का वर्णन करें',
    sym_finder_input_placeholder: 'उदा: बुखार, छाती में दर्द, बच्चे को तेज खांसी, जोड़ों में दर्द, पेट दर्द...',
    sym_finder_quick_concerns: 'त्वरित स्वास्थ्य समस्याएं:',
    sym_finder_location_label: 'आपका शहर या जिला',
    sym_finder_distance_label: 'अधिकतम दूरी',
    sym_finder_distance_any: 'कोई भी दूरी (पूरे शहर में)',
    sym_finder_distance_5km: '5 किमी के भीतर',
    sym_finder_distance_10km: '10 किमी के भीतर',
    sym_finder_distance_25km: '25 किमी के भीतर',
    sym_finder_distance_50km: '50 किमी के भीतर',
    sym_finder_suggested_specialties: 'सुझाए गए चिकित्सा विभाग:',
    sym_finder_matching_hospitals: 'आवश्यक सुविधाओं से युक्त अस्पताल:',
    sym_finder_matching_doctors: 'परामर्श के लिए उपलब्ध डॉक्टर:',
    sym_finder_compare_facilities: 'अस्पताल सुविधाओं की तुलना:',
    sym_finder_disclaimer_title: 'महत्वपूर्ण नैदानिक व सुरक्षा अस्वीकरण',
    sym_finder_disclaimer_text: 'यह केवल एक सूचनात्मक डायरेक्टरी गाइड है और कोई चिकित्सीय निदान या उपचार प्रदान नहीं करती है। हमेशा योग्य डॉक्टर से परामर्श लें।',
    sym_finder_emergency_warning: 'आपातकालीन चेतावनी: तेज सीने में दर्द, सांस लेने में अत्यधिक कठिनाई या पक्षाघात के लक्षण होने पर ओपीडी अपॉइंटमेंट की प्रतीक्षा न करें। तुरंत 108 या 112 डायल करें या निकटतम आपातकालीन कक्ष में जाएं।',

    doc_page_title: 'भारत भर में सत्यापित डॉक्टर खोजें',
    doc_page_subtitle: 'राज्य मेडिकल काउंसिल द्वारा सत्यापित पंजीकरण संख्या वाले अनुभवी विशेषज्ञ।',
    doc_search_placeholder: 'डॉक्टर का नाम, विशेषज्ञता, अस्पताल, पंजीकरण संख्या...',
    doc_not_found: 'कोई डॉक्टर नहीं मिला। अन्य नाम, शहर या विशेषज्ञता का प्रयास करें।',
    doc_experience: 'अनुभव',
    doc_consultation_fee: 'परामर्श शुल्क',
    doc_reg_number: 'काउंसिल पंजीकरण #',
    doc_available_slots: 'आज के उपलब्ध समय स्लॉट',

    apt_page_title: 'डॉक्टर परामर्श अपॉइंटमेंट बुक करें',
    apt_page_subtitle: 'सीधे अस्पताल अपॉइंटमेंट — शून्य प्लेटफ़ॉर्म कमीशन। आपका पूरा परामर्श शुल्क आपके डॉक्टर को जाता है।',
    apt_select_hospital: 'अस्पताल या क्लिनिक चुनें',
    apt_select_doctor: 'डॉक्टर चुनें',
    apt_select_date: 'अपॉइंटमेंट तिथि चुनें',
    apt_select_slot: 'समय स्लॉट चुनें',
    apt_patient_name: 'मरीज का पूरा नाम',
    apt_patient_phone: 'मोबाइल नंबर (+91)',
    apt_symptoms_reason: 'परामर्श का कारण / लक्षण (वैकल्पिक)',
    apt_confirm_booking: 'पुष्टि करें और ओपीडी टोकन पाएं',
    apt_booking_success: 'अपॉइंटमेंट सफलतापूर्वक बुक हो गया!',
    apt_booking_ref: 'बुकिंग संदर्भ आईडी',
    apt_your_opd_token: 'आपका डिजिटल ओपीडी टोकन नंबर',
    apt_reschedule: 'समय बदलें',
    apt_cancel: 'अपॉइंटमेंट रद्द करें',
    apt_my_appointments: 'मेरी अपॉइंटमेंट्स',

    notif_settings_title: 'अग्रिम ओपीडी कतार सूचनाएं',
    notif_settings_desc: 'अपनी बारी आने से पहले मोबाइल पर अलर्ट प्राप्त करें ताकि आपको भीड़भाड़ में घंटों इंतजार न करना पड़े।',
    notif_channel_label: 'सूचना का माध्यम',
    notif_channel_sms: 'एसएमएस (SMS)',
    notif_channel_push: 'पुश नोटिफिकेशन',
    notif_channel_both: 'दोनों (SMS और पुश)',
    notif_channel_none: 'कोई सूचना नहीं',
    notif_timing_label: 'बारी से कितने समय पहले सूचना चाहिए?',
    notif_timing_30m: '30 मिनट पहले',
    notif_timing_20m: '20 मिनट पहले',
    notif_timing_15m: '15 मिनट पहले',
    notif_timing_10m: '10 मिनट पहले',
    notif_timing_5m: '5 मिनट पहले',
    notif_timing_custom: 'अनुकूलित समय (Custom)',
    notif_custom_minutes_placeholder: 'मिनट दर्ज करें (जैसे 25)',
    notif_consent_checkbox: 'मैं अपने मोबाइल पर कतार और अपॉइंटमेंट एसएमएस सूचनाएं प्राप्त करने के लिए सहमति देता/देती हूँ।',
    notif_gateway_transparency_note: 'गेटवे स्थिति: TRAI-DLT अनुमोदित टेम्प्लेट। वास्तविक प्रेषण सक्रिय गेटवे द्वारा ही किया जाता है।',

    queue_page_title: 'लाइव अस्पताल ओपीडी कतार ट्रैकर',
    queue_page_subtitle: 'वास्तविक समय डिजिटल टोकन डिस्प्ले। जानें आपकी बारी कब आएगी।',
    queue_now_serving: 'वर्तमान में चल रहा टोकन',
    queue_your_token: 'आपका ओपीडी टोकन नंबर',
    queue_patients_ahead: 'आपके आगे कितने मरीज हैं',
    queue_est_wait_time: 'अनुमानित प्रतीक्षा समय',
    queue_select_hospital: 'अस्पताल चुनें',
    queue_select_session: 'ओपीडी सत्र',
    queue_staff_controls: 'स्टाफ डेस्क नियंत्रण (रिसेप्शनिस्ट / डॉक्टर)',
    queue_call_next: 'अगला टोकन बुलाएं',
    queue_mark_delayed: 'मरीज देर से पहुंचे',
    queue_mark_absent: 'अनुपस्थित / आगे बढ़ें',
    queue_mark_completed: 'परामर्श पूर्ण चिह्नित करें',

    ai_page_title: 'AI बहुभाषी स्वास्थ्य सहायक',
    ai_page_subtitle: 'तेलुगु, हिंदी और अंग्रेजी में वास्तविक सत्यापित अस्पतालों और डॉक्टरों की जानकारी देने वाला सहायक।',
    ai_input_placeholder: 'Apex Hospital, राजमुंदरी, बुखार क्लिनिक, KIMS हैदराबाद, ओपीडी टोकन के बारे में पूछें...',
    ai_speak_or_type: 'बोलें या प्रश्न टाइप करें...',
    ai_listening: 'सुन रहा हूँ... कृपया बोलें',
    ai_sources_label: 'सत्यापित डेटाबेस स्रोत:',
    ai_suggested_queries_title: 'सुझाए गए प्रश्न:',
    ai_safety_disclaimer: 'केवल सूचनात्मक सहायक। दवा या इलाज का नुस्खा नहीं देता। आपातकाल में 108 डायल करें।',
    ai_clear_chat: 'बातचीत साफ़ करें',
    ai_auto_speak: 'उत्तर स्वतः बोलकर सुनाएं',

    rev_page_title: 'प्लेटफ़ॉर्म सॉफ्टवेयर योजनाएं व दरें',
    rev_page_subtitle: 'मरीजों, स्वतंत्र डॉक्टरों और अस्पतालों के लिए पारदर्शी सॉफ्टवेयर सदस्यता योजनाएं।',
    rev_ethics_title: '0% डॉक्टर कमीशन नीति व वित्तीय आचार संहिता',
    rev_ethics_text: 'मरीज द्वारा दी गई फीस 100% डॉक्टर को जाती है। Universal Health Care AI कोई बुकिंग कमीशन नहीं लेता।',
    rev_zero_cut_badge: '0% डॉक्टर कमीशन गारंटी',
    rev_monthly_billing: 'मासिक बिलिंग',
    rev_annual_billing: 'वार्षिक बिलिंग',
    rev_save_15: '15% की बचत',
    rev_tab_patient: 'मरीज योजनाएं',
    rev_tab_doctor: 'डॉक्टर योजनाएं',
    rev_tab_hospital: 'अस्पताल योजनाएं',
    rev_tab_admin: 'एडमिन नियंत्रण',
    rev_subscribe_btn: 'सब्सक्राइब करें (सैंडबॉक्स)',

    spec_page_title: 'चिकित्सा विशेषज्ञता डायरेक्टरी',
    spec_page_subtitle: '26 से अधिक चिकित्सा विभाग, संबंधित लक्षण और मान्यता प्राप्त अस्पतालों की सूची।',
    spec_search_placeholder: 'विशेषज्ञता खोजें (जैसे कार्डियोलॉजी, बाल रोग, न्यूरोलॉजी, हड्डी रोग)...',
    spec_find_hospitals_btn: 'इस विभाग वाले अस्पताल',
    spec_find_doctors_btn: 'विशेषज्ञों से परामर्श लें',
    spec_common_symptoms: 'इलाज की जाने वाली सामान्य समस्याएं:',

    rec_page_title: 'डिजिटल स्वास्थ्य रिकॉर्ड लॉकर',
    rec_page_subtitle: 'डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम के अनुसार एन्क्रिप्टेड निजी लॉकर।',
    rec_upload_btn: 'दस्तावेज़ अपलोड करें',
    rec_family_btn: 'परिवार के सदस्य',
    rec_dpdp_guarantee: 'मरीज की अनुमति पर ही उपलब्ध। विज्ञापन के लिए डेटा कभी साझा नहीं किया जाता।',

    admin_page_title: 'चिकित्सा रजिस्ट्रार प्रशासन',
    admin_page_subtitle: 'काउंसिल पंजीकरण ऑडिट, लाइव कतार प्रबंधन, एसएमएस गेटवे और सदस्यता योजनाएं।',
    admin_tab_doctor_audits: 'डॉक्टर ऑडिट्स',
    admin_tab_hospital_audits: 'अस्पताल ऑडिट्स',
    admin_tab_live_queues: 'लाइव अस्पताल कतारें',
    admin_tab_sms_gateway: 'एसएमएस गेटवे स्थिति',
    admin_tab_pricing: 'सदस्यता दरें',
    admin_tab_audit_logs: 'ऑडिट व अनुपालन लॉग्स',
    admin_tab_register_doctor: '+ नया डॉक्टर पंजीकृत करें',
  },
};

// Attach dotted alias mappings for seamless component interoperability
const augmentWithAliases = (dict: TranslationDictionary, lang: Language) => {
  // Navigation
  dict['nav.home'] = dict.nav_home;
  dict['nav.doctors'] = dict.nav_find_doctors;
  dict['nav.hospitals'] = dict.nav_hospitals;
  dict['nav.symptomFinder'] = dict.nav_symptom_finder;
  dict['nav.specialties'] = dict.nav_specializations;
  dict['nav.appointments'] = dict.nav_appointments;
  dict['nav.assistant'] = dict.nav_ai_assistant;
  dict['nav.queue'] = dict.nav_queue;
  dict['nav.records'] = dict.nav_health_records;
  dict['nav.revenue'] = dict.nav_revenue;
  dict['nav.admin'] = dict.nav_admin_portal;
  dict['nav.emergency'] = dict.nav_emergency_helpline;
  dict['nav.dial108'] = dict.nav_dial_108;
  dict['nav.signIn'] = dict.nav_signin;

  // Hospitals page
  dict['hospitals.clearSearch'] = lang === 'Telugu' ? 'శోధనను తొలగించు' : lang === 'Hindi' ? 'खोज साफ़ करें' : 'Clear Search';
  dict['hospitals.emergencyPhone'] = lang === 'Telugu' ? '24x7 అత్యవసర లైన్:' : lang === 'Hindi' ? '24x7 आपातकालीन नंबर:' : '24x7 Emergency Line:';
  dict['hospitals.departments'] = lang === 'Telugu' ? 'ప్రత్యేక విభాగాలు' : lang === 'Hindi' ? 'विशेष विभाग' : 'Specialty Departments';
  dict['hospitals.facilities'] = lang === 'Telugu' ? 'సౌకర్యాలు & పరికరాలు' : lang === 'Hindi' ? 'सुविधाएं एवं उपकरण' : 'Facilities & Equipment';
  dict['hospitals.viewDetails'] = lang === 'Telugu' ? 'వివరాలు చూడండి' : lang === 'Hindi' ? 'विवरण देखें' : 'View Details';
  dict['hospitals.viewDoctors'] = lang === 'Telugu' ? 'డాక్టర్లను చూడండి' : lang === 'Hindi' ? 'डॉक्टर देखें' : 'View Doctors';
  dict['hospitals.trackQueue'] = lang === 'Telugu' ? 'క్యూ ట్రాక్ చేయండి' : lang === 'Hindi' ? 'कतार ट्रैक करें' : 'Track OPD Queue';
  dict['hospitals.loadMore'] = lang === 'Telugu' ? 'మరిన్ని ఆసుపత్రులను లోడ్ చేయండి' : lang === 'Hindi' ? 'और अस्पताल लोड करें' : 'Load More Hospitals';

  // Revenue Dashboard
  dict['revenue.title'] = dict.rev_page_title;
  dict['revenue.subtitle'] = dict.rev_page_subtitle;
  dict['revenue.zeroCommissionCharter'] = dict.rev_charter_title;
  dict['revenue.charterDesc'] = dict.rev_charter_desc;
  dict['revenue.patientPlans'] = dict.rev_tab_patient;
  dict['revenue.doctorPlans'] = dict.rev_tab_doctor;
  dict['revenue.hospitalPlans'] = dict.rev_tab_hospital;
  dict['revenue.adminDashboard'] = dict.rev_tab_admin;
  dict['revenue.monthly'] = dict.rev_monthly;
  dict['revenue.annual'] = dict.rev_annual;
  dict['revenue.save15'] = dict.rev_save_15;
  dict['revenue.grossRevenue'] = lang === 'Telugu' ? 'స్థూల ప్లాట్‌ఫారమ్ ఆదాయం' : lang === 'Hindi' ? 'सकल राजस्व' : 'Gross Platform Revenue';
  dict['revenue.operationalCost'] = lang === 'Telugu' ? 'నిర్వహణ మరియు సర్వర్ వ్యయం' : lang === 'Hindi' ? 'परिचालन लागत' : 'Operational Cost';
  dict['revenue.refundsIssued'] = lang === 'Telugu' ? 'తిరిగి చెల్లించిన మొత్తం' : lang === 'Hindi' ? 'जारी किए गए रिफंड' : 'Refunds Processed';
  dict['revenue.netProfit'] = lang === 'Telugu' ? 'నికర ప్లాట్‌ఫారమ్ మార్జిన్' : lang === 'Hindi' ? 'शुद्ध लाभ' : 'Net Margin';
  dict['revenue.transactionTracking'] = lang === 'Telugu' ? 'లావాదేవీల ట్రాకింగ్ మరియు రిఫండ్ నిర్వహణ' : lang === 'Hindi' ? 'लेन-देन एवं रिफंड प्रबंधन' : 'Transaction Tracking & Refund Management';
  dict['revenue.processRefund'] = lang === 'Telugu' ? 'రిఫండ్ చేయండి' : lang === 'Hindi' ? 'रिफंड करें' : 'Process Refund';
  dict['revenue.subscribeNow'] = dict.rev_subscribe_btn;

  // Specialties
  dict['specialties.title'] = dict.spec_page_title;
  dict['specialties.subtitle'] = dict.spec_page_subtitle;
  dict['specialties.searchPlaceholder'] = dict.spec_search_placeholder;
  dict['specialties.allCategories'] = lang === 'Telugu' ? 'అన్ని వర్గాలు' : lang === 'Hindi' ? 'सभी श्रेणियां' : 'All Categories';
  dict['specialties.findHospitals'] = dict.spec_find_hospitals_btn;
  dict['specialties.findDoctors'] = dict.spec_find_doctors_btn;

  // Symptoms
  dict['symptoms.bannerBadge'] = lang === 'Telugu' ? 'లక్షణాల ఆధారంగా ఆసుపత్రి ఎంపిక' : lang === 'Hindi' ? 'लक्षण-आधारित अस्पताल खोज' : 'Disease & Symptom Hospital Finder';
  dict['symptoms.title'] = dict.sym_finder_title;
  dict['symptoms.subtitle'] = dict.sym_finder_subtitle;
  dict['symptoms.searchPlaceholder'] = dict.sym_finder_input_placeholder;
  dict['common.loading'] = lang === 'Telugu' ? 'లోడ్ అవుతోంది...' : lang === 'Hindi' ? 'लोड हो रहा है...' : 'Loading...';
  dict['symptoms.findCare'] = lang === 'Telugu' ? 'ఆసుపత్రులను కనుగొనండి' : lang === 'Hindi' ? 'अस्पताल खोजें' : 'Find Care';
  dict['symptoms.emergencyTitle'] = dict.sym_finder_disclaimer_title;
  dict['symptoms.emergencyDesc'] = dict.sym_finder_disclaimer_text;
  dict['symptoms.commonHealthConcerns'] = dict.sym_finder_quick_concerns;
  dict['symptoms.suitableHospitals'] = dict.sym_finder_matching_hospitals;
  dict['symptoms.verifiedSpecialists'] = dict.sym_finder_matching_doctors;
  dict['symptoms.compareFacilities'] = dict.sym_finder_compare_facilities;

  // Appointments Cancellation Modal
  dict['appointments.cancelConfirmTitle'] = lang === 'Telugu' ? 'ఈ అపాయింట్‌మెంట్‌ను రద్దు చేయాలనుకుంటున్నారా?' : lang === 'Hindi' ? 'क्या आप वाकई इस अपॉइंटमेंट को रद्द करना चाहते हैं?' : 'Are you sure you want to cancel this appointment?';
  dict['appointments.cancelConfirmDesc'] = lang === 'Telugu' ? 'రద్దు చేసిన తర్వాత ఈ సమయం మరియు OPD టోకెన్ విడుదల చేయబడతాయి.' : lang === 'Hindi' ? 'रद्द करने के बाद समय स्लॉट और ओपीडी टोकन जारी कर दिया जाएगा।' : 'The booked time slot and associated live OPD queue token will be released.';
  dict['appointments.confirmCancellation'] = lang === 'Telugu' ? 'రద్దును నిర్ధారించండి' : lang === 'Hindi' ? 'रद्द करना सुनिश्चित करें' : 'Confirm Cancellation';
  dict['appointments.keepAppointment'] = lang === 'Telugu' ? 'అపాయింట్‌మెంట్‌ను ఉంచండి' : lang === 'Hindi' ? 'अपॉइंटमेंट रखें' : 'Keep Appointment';
  dict['appointments.cancelSuccess'] = lang === 'Telugu' ? 'అపాయింట్‌మెంట్ విజయవంతంగా రద్దు చేయబడింది. సమయం విడుదల చేయబడింది.' : lang === 'Hindi' ? 'अपॉइंटमेंट सफलतापूर्वक रद्द कर दिया गया। समय स्लॉट जारी कर दिया गया है।' : 'Appointment cancelled successfully. The booked time slot has been released.';
  dict['appointments.cancelReasonLabel'] = lang === 'Telugu' ? 'రద్దు కారణం (ఐచ్ఛికం)' : lang === 'Hindi' ? 'रद्द करने का कारण (वैकल्पिक)' : 'Reason for Cancellation (Optional)';

  // Booking Summary & Payment
  dict['booking.summaryTitle'] = lang === 'Telugu' ? 'అపాయింట్‌మెంట్ బుకింగ్ సారాంశం' : lang === 'Hindi' ? 'अपॉइंटमेंट बुकिंग सारांश' : 'Appointment Booking Summary';
  dict['booking.summaryDesc'] = lang === 'Telugu' ? 'చెల్లింపుకు ముందు దయచేసి వివరాలను సరిచూసుకోండి' : lang === 'Hindi' ? 'भुगतान से पहले कृपया विवरण की पुष्टि करें' : 'Please review your consultation details before proceeding to payment';
  dict['booking.confirmBooking'] = lang === 'Telugu' ? 'బుకింగ్‌ను నిర్ధారించండి & చెల్లించండి' : lang === 'Hindi' ? 'बुकिंग कन्फर्म करें और भुगतान करें' : 'Confirm Booking & Proceed to Payment';
  dict['booking.editDetails'] = lang === 'Telugu' ? 'వివరాలను సవరించండి' : lang === 'Hindi' ? 'विवरण संपादित करें' : 'Back & Edit Details';
  dict['booking.totalPayable'] = lang === 'Telugu' ? 'మొత్తం చెల్లించవలసినది' : lang === 'Hindi' ? 'कुल देय राशि' : 'Total Payable Amount';
  dict['booking.platformFeeZero'] = lang === 'Telugu' ? '0% ప్లాట్‌ఫారమ్ రుసుము (ఉచిత సంరక్షణ)' : lang === 'Hindi' ? '0% प्लेटफॉर्म शुल्क (मुफ़्त सुविधा)' : '0% Platform Fee (Universal Health Charter)';

  // Payment Page
  dict['payment.pageTitle'] = lang === 'Telugu' ? 'సురక్షిత ఆరోగ్య సంరక్షణ చెల్లింపు' : lang === 'Hindi' ? 'सुरक्षित स्वास्थ्य सेवा भुगतान' : 'Secure Healthcare Payment';
  dict['payment.pageSubtitle'] = lang === 'Telugu' ? 'మీ లైవ్ OPD టోకెన్‌ను రూపొందించడానికి చెల్లింపు పద్ధతిని ఎంచుకోండి.' : lang === 'Hindi' ? 'अपना लाइव ओपीडी टोकन उत्पन्न करने के लिए पसंदीदा भुगतान विधि चुनें।' : 'Select your preferred payment method to generate your live OPD appointment token.';
  dict['payment.selectMethod'] = lang === 'Telugu' ? 'చెల్లింపు పద్ధతిని ఎంచుకోండి' : lang === 'Hindi' ? 'भुगतान विधि चुनें' : 'Select Payment Method';
  dict['payment.payNow'] = lang === 'Telugu' ? 'చెల్లించి నిర్ధారించండి' : lang === 'Hindi' ? 'भुगतान करें और पुष्टि करें' : 'Pay & Confirm Appointment';
  dict['payment.demoModeBadge'] = lang === 'Telugu' ? 'డెమో టెస్ట్ మోడ్ యాక్టివ్' : lang === 'Hindi' ? 'डेमो / टेस्ट मोड सक्रिय' : 'Demo / Sandbox Payment Mode';
  dict['payment.demoModeDesc'] = lang === 'Telugu' ? 'బ్యాంక్ ఖాతా నుండి డబ్బు కట్ అవ్వకుండా తక్షణమే అపాయింట్‌మెంట్ నిర్ధారించబడుతుంది.' : lang === 'Hindi' ? 'बैंक खाते से राशि काटे बिना तत्काल सुरक्षित पुष्टि प्रदान की जाती है।' : 'Simulated payment succeeds immediately for seamless testing without financial deduction.';
  dict['payment.phonePeDesc'] = lang === 'Telugu' ? 'PhonePe UPI యాప్ లేదా నంబర్ ద్వారా' : lang === 'Hindi' ? 'PhonePe UPI ऐप या नंबर के माध्यम से' : 'Fast UPI payment via PhonePe app';
  dict['payment.gpayDesc'] = lang === 'Telugu' ? 'Google Pay తక్షణ UPI బదిలీ' : lang === 'Hindi' ? 'Google Pay तत्काल यूपीआई भुगतान' : 'Instant UPI transfer via Google Pay';
  dict['payment.upiDesc'] = lang === 'Telugu' ? 'ఏదైనా UPI ID (BHIM, Paytm, మొదలైనవి) లేదా QR కోడ్' : lang === 'Hindi' ? 'कोई भी यूपीआई आईडी या क्यूआर कोड' : 'Any UPI ID (BHIM, Paytm, Cred) or QR scan';
  dict['payment.cardsDesc'] = lang === 'Telugu' ? 'డెబిట్ / క్రెడిట్ కార్డ్ లేదా ఆసుపత్రి కౌంటర్ వద్ద' : lang === 'Hindi' ? 'डेबिट/क्रेडिट कार्ड या अस्पताल काउंटर पर' : 'Debit/Credit Cards, Netbanking or Cash at Hospital';

  // Appointment Success Page
  dict['success.bookingSuccess'] = lang === 'Telugu' ? 'అపాయింట్‌మెంట్ విజయవంతంగా బుక్ చేయబడింది!' : lang === 'Hindi' ? 'अपॉइंटमेंट सफलतापूर्वक बुक हो गया!' : 'Appointment Booking Successful!';
  dict['success.subtitle'] = lang === 'Telugu' ? 'మీ అపాయింట్‌మెంట్ నిర్ధారించబడింది మరియు ఆసుపత్రి డేటాబేస్‌లో నమోదు చేయబడింది.' : lang === 'Hindi' ? 'आपका परामर्श कन्फर्म हो गया है और अस्पताल डेटाबेस में दर्ज है।' : 'Your consultation has been confirmed and registered in the hospital database.';
  dict['success.tokenLabel'] = lang === 'Telugu' ? 'మీ OPD టోకెన్ నంబర్' : lang === 'Hindi' ? 'आपका ओपीडी टोकन नंबर' : 'Your Token Number';
  dict['success.servingLabel'] = lang === 'Telugu' ? 'ప్రస్తుతం పరిశీలిస్తున్నది' : lang === 'Hindi' ? 'वर्तमान सेवारत' : 'Currently Serving';
  dict['success.aheadLabel'] = lang === 'Telugu' ? 'మీ కంటే ముందు ఉన్న రోగులు' : lang === 'Hindi' ? 'आपके आगे मरीज' : 'Patients Ahead of You';
  dict['success.estWaitLabel'] = lang === 'Telugu' ? 'అంచనా వేసిన నిరీక్షణ సమయం' : lang === 'Hindi' ? 'अनुमानित प्रतीक्षा समय' : 'Estimated Waiting Time';
  dict['success.queueStatusLabel'] = lang === 'Telugu' ? 'క్యూ స్థితి' : lang === 'Hindi' ? 'कतार स्थिति' : 'Queue Status';
  dict['success.viewMyAppointment'] = lang === 'Telugu' ? 'నా అపాయింట్‌మెంట్ చూడండి' : lang === 'Hindi' ? 'मेरा अपॉइंटमेंट देखें' : 'View My Appointment';
  dict['success.downloadReceipt'] = lang === 'Telugu' ? 'అపాయింట్‌మెంట్ రసీదు డౌన్‌లోడ్ చేయండి' : lang === 'Hindi' ? 'अपॉइंटमेंट रसीद डाउनलोड करें' : 'Download Appointment Receipt';
  dict['success.cancelAppointment'] = lang === 'Telugu' ? 'అపాయింట్‌మెంట్ రద్దు చేయండి' : lang === 'Hindi' ? 'अपॉइंटमेंट रद्द करें' : 'Cancel Appointment';

  // Real-time Queue Tracking
  dict['queue.realtimeTracking'] = lang === 'Telugu' ? 'రియల్-టైమ్ OPD క్యూ ట్రాకింగ్' : lang === 'Hindi' ? 'रीयल-टाइम ओपीडी कतार ट्रैकिंग' : 'Real-Time OPD Queue Tracking';
  dict['queue.patientsCompleted'] = lang === 'Telugu' ? 'ముగిసిన సంప్రదింపులు' : lang === 'Hindi' ? 'पूर्ण हुए परामर्श' : 'Patients Completed';
  dict['queue.progress'] = lang === 'Telugu' ? 'క్యూ పురోగతి' : lang === 'Hindi' ? 'कतार प्रगति' : 'Queue Progress';
  dict['queue.liveSync'] = lang === 'Telugu' ? 'లైవ్ అప్‌డేట్ అవుతోంది' : lang === 'Hindi' ? 'लाइव अपडेट हो रहा है' : 'Live Sync Active';

  // Navigation for 5 New Advanced Modules
  dict['nav.reportExplainer'] = lang === 'Telugu' ? 'AI రిపోర్ట్ వివరణ' : lang === 'Hindi' ? 'AI रिपोर्ट विश्लेषक' : 'AI Report Explainer';
  dict['nav.bedAvailability'] = lang === 'Telugu' ? 'లైవ్ బెడ్లు' : lang === 'Hindi' ? 'लाइव बेड' : 'Live Beds';
  dict['nav.emergency'] = lang === 'Telugu' ? 'అత్యవసర 24/7' : lang === 'Hindi' ? 'आपातकाल 24/7' : 'Emergency 24/7';
  dict['nav.medicineReminder'] = lang === 'Telugu' ? 'మందుల రిమైండర్' : lang === 'Hindi' ? 'दवा रिमाइंडर' : 'Medicine Reminder';
  dict['nav.familyProfiles'] = lang === 'Telugu' ? 'కుటుంబ ఆరోగ్యం' : lang === 'Hindi' ? 'परिवार स्वास्थ्य' : 'Family Health';

  // MODULE 1: AI MEDICAL REPORT EXPLAINER
  dict['report.pageTitle'] = lang === 'Telugu' ? 'AI మెడికల్ రిపోర్ట్ వివరణ వ్యవస్థ' : lang === 'Hindi' ? 'AI मेडिकल रिपोर्ट विश्लेषक एवं मार्गदर्शक' : 'AI Medical Report Explainer';
  dict['report.pageSubtitle'] = lang === 'Telugu' ? 'ల్యాబ్ నివేదికలను అప్‌లోడ్ చేయండి. వైద్య పరిభాషను సులభమైన భాషలో అర్థం చేసుకోండి మరియు డాక్టర్‌ను అడగవలసిన ప్రశ్నలను తెలుసుకోండి.' : lang === 'Hindi' ? 'अपनी लैब रिपोर्ट अपलोड करें। चिकित्सीय मापदंडों को सरल भाषा में समझें और डॉक्टर से परामर्श हेतु आवश्यक प्रश्न प्राप्त करें।' : 'Upload lab reports to understand clinical parameters, reference ranges, and tailored doctor consultation questions.';
  dict['report.uploadTitle'] = lang === 'Telugu' ? 'మెడికల్ రిపోర్ట్ అప్‌లోడ్ చేయండి' : lang === 'Hindi' ? 'मेडिकल रिपोर्ट अपलोड करें' : 'Upload Medical Report';
  dict['report.uploadSubtitle'] = lang === 'Telugu' ? 'PDF, JPG, లేదా PNG ఫైల్‌లను డ్రాగ్ & డ్రాప్ చేయండి లేదా ఎంచుకోండి' : lang === 'Hindi' ? 'पीडीएफ, जेपीजी या पीएनजी फाइलें चुनें या ड्रैग करें' : 'Drag & drop or browse PDF, JPG, or PNG files';
  dict['report.sampleCbc'] = lang === 'Telugu' ? 'నమూనా CBC బ్లడ్ టెస్ట్' : lang === 'Hindi' ? 'सैंपल सीबीसी ब्लड टेस्ट' : 'Sample CBC Blood Test';
  dict['report.sampleLipid'] = lang === 'Telugu' ? 'నమూనా లిపిడ్ ప్రొఫైల్' : lang === 'Hindi' ? 'सैंपल लिपिड प्रोफाइल' : 'Sample Lipid Profile';
  dict['report.sampleSugar'] = lang === 'Telugu' ? 'నమూనా డయాబెటిస్ HbA1c' : lang === 'Hindi' ? 'सैंपल डायबिटीज HbA1c' : 'Sample Diabetes HbA1c';
  dict['report.analyzing'] = lang === 'Telugu' ? 'AI పారామితులను విశ్లేషిస్తోంది...' : lang === 'Hindi' ? 'AI रिपोर्ट का विश्लेषण कर रहा है...' : 'AI is analyzing parameters...';
  dict['report.analyzeBtn'] = lang === 'Telugu' ? 'రిపోర్ట్‌ను విశ్లేషించండి' : lang === 'Hindi' ? 'रिपोर्ट का विश्लेषण करें' : 'Analyze Report';
  dict['report.disclaimerTitle'] = lang === 'Telugu' ? 'ముఖ్యమైన వైద్య నిరాకరణ' : lang === 'Hindi' ? 'महत्वपूर्ण चिकित्सीय अस्वीकरण' : 'Important Clinical Disclaimer';
  dict['report.disclaimerText'] = lang === 'Telugu' ? 'ఈ AI విశ్లేషణ కేవలం అవగాహన కొరకు మాత్రమే. ఇది రోగ నిర్ధారణ లేదా చికిత్స కాదు. ఎట్టి పరిస్థితుల్లోనూ వైద్యుని సంప్రదించకుండా మందులను మార్చవద్దు.' : lang === 'Hindi' ? 'यह एआई विश्लेषण केवल शैक्षिक समझ के लिए है। यह चिकित्सीय निदान या उपचार नहीं है। डॉक्टर की सलाह के बिना कभी भी दवाएं न बदलें।' : 'Universal Health Care AI provides plain-language educational summaries only. This is not a diagnosis or prescription. Always consult a verified physician for clinical decisions.';
  dict['report.measuredValue'] = lang === 'Telugu' ? 'కొలిచిన విలువ' : lang === 'Hindi' ? 'मापा गया मान' : 'Measured Value';
  dict['report.referenceRange'] = lang === 'Telugu' ? 'ప్రామాణిక పరిధి' : lang === 'Hindi' ? 'संदर्भ सीमा' : 'Reference Range';
  dict['report.statusNormal'] = lang === 'Telugu' ? 'సాధారణం' : lang === 'Hindi' ? 'सामान्य' : 'Normal';
  dict['report.statusHigh'] = lang === 'Telugu' ? 'అధికం' : lang === 'Hindi' ? 'अधिक' : 'High';
  dict['report.statusLow'] = lang === 'Telugu' ? 'తక్కువ' : lang === 'Hindi' ? 'कम' : 'Low';
  dict['report.questionsTitle'] = lang === 'Telugu' ? 'మీ డాక్టర్‌ను అడగవలసిన ప్రశ్నలు' : lang === 'Hindi' ? 'अपने डॉक्टर से पूछने योग्य प्रश्न' : 'Questions to Ask Your Doctor';
  dict['report.savedReports'] = lang === 'Telugu' ? 'భద్రపరచబడిన నివేదికలు' : lang === 'Hindi' ? 'सहेजी गई रिपोर्ट' : 'Saved Reports Vault';

  // MODULE 2: LIVE BED AVAILABILITY
  dict['beds.pageTitle'] = lang === 'Telugu' ? 'లైవ్ ఆసుపత్రి బెడ్ల లభ్యత' : lang === 'Hindi' ? 'लाइव अस्पताल बेड उपलब्धता ट्रैकर' : 'Live Hospital Bed Availability';
  dict['beds.pageSubtitle'] = lang === 'Telugu' ? 'ధృవీకరించబడిన ఆసుపత్రుల జనరల్, ICU మరియు అత్యవసర బెడ్ల రియల్-టైమ్ స్థితి.' : lang === 'Hindi' ? 'सत्यापित अस्पतालों में जनरल, आईसीयू और आपातकालीन बेड की वास्तविक समय की जानकारी।' : 'Real-time verified hospital bed availability across General, ICU, and Emergency trauma wards.';
  dict['beds.generalBeds'] = lang === 'Telugu' ? 'జనరల్ వార్డ్ బెడ్లు' : lang === 'Hindi' ? 'जनरल वार्ड बेड' : 'General Ward Beds';
  dict['beds.icuBeds'] = lang === 'Telugu' ? 'ICU బెడ్లు' : lang === 'Hindi' ? 'आईसीयू (ICU) बेड' : 'ICU Beds';
  dict['beds.emergencyBeds'] = lang === 'Telugu' ? 'ఎమర్జెన్సీ / ట్రామా బెడ్లు' : lang === 'Hindi' ? 'आपातकालीन / ट्रॉमा बेड' : 'Emergency & Trauma Beds';
  dict['beds.ventilatorBeds'] = lang === 'Telugu' ? 'వెంటిలేటర్ బెడ్లు' : lang === 'Hindi' ? 'वेंटिलेटर बेड' : 'Ventilator Beds';
  dict['beds.oxygenBeds'] = lang === 'Telugu' ? 'ఆక్సిజన్ సదుపాయం ఉన్న బెడ్లు' : lang === 'Hindi' ? 'ऑक्सीजन युक्त बेड' : 'Oxygen Equipped Beds';
  dict['beds.available'] = lang === 'Telugu' ? 'అందుబాటులో ఉన్నాయి' : lang === 'Hindi' ? 'उपलब्ध' : 'Available';
  dict['beds.total'] = lang === 'Telugu' ? 'మొత్తం' : lang === 'Hindi' ? 'कुल' : 'Total';
  dict['beds.lastUpdated'] = lang === 'Telugu' ? 'చివరిగా అప్‌డేట్ చేసిన సమయం' : lang === 'Hindi' ? 'अंतिम अपडेट' : 'Last Updated';
  dict['beds.staffUpdateBtn'] = lang === 'Telugu' ? 'బెడ్ల లభ్యతను అప్‌డేట్ చేయండి (సిబ్బంది డెస్క్)' : lang === 'Hindi' ? 'बेड उपलब्धता अपडेट करें (स्टाफ डेस्क)' : 'Update Bed Availability (Staff Desk)';
  dict['beds.verifiedNotice'] = lang === 'Telugu' ? 'ధృవీకరించబడిన ఆసుపత్రి నివేదికల ఆధారంగా మాత్రమే' : lang === 'Hindi' ? 'केवल सत्यापित अस्पताल-रिपोर्ट किए गए डेटा के आधार पर' : 'Verified Hospital-Reported Records Only';
  dict['beds.filterCity'] = lang === 'Telugu' ? 'నగరం ఎంచుకోండి' : lang === 'Hindi' ? 'शहर चुनें' : 'Filter by City';
  dict['beds.filterType'] = lang === 'Telugu' ? 'బెడ్ రకం' : lang === 'Hindi' ? 'बेड प्रकार' : 'Bed Type';

  // MODULE 3: EMERGENCY COORDINATION
  dict['emergency.pageTitle'] = lang === 'Telugu' ? '24/7 అత్యవసర సహాయ సమన్వయం' : lang === 'Hindi' ? '24/7 आपातकालीन सहायता एवं समन्वय' : '24/7 Emergency Medical Coordination';
  dict['emergency.pageSubtitle'] = lang === 'Telugu' ? 'తక్షణ అంబులెన్స్, సమీప అత్యవసర ఆసుపత్రులు, లైవ్ లొకేషన్ షేరింగ్ మరియు ప్రథమ చికిత్స మార్గదర్శకాలు.' : lang === 'Hindi' ? 'तत्काल एम्बुलेंस, नजदीकी आपातकालीन अस्पताल, लाइव लोकेशन शेयरिंग और प्राथमिक चिकित्सा निर्देश।' : 'Immediate ambulance access, nearest emergency trauma centers, live GPS sharing, and first aid guidance.';
  dict['emergency.dial108'] = lang === 'Telugu' ? '108 అంబులెన్స్ కాల్ చేయండి' : lang === 'Hindi' ? '108 एम्बुलेंस डायल करें' : 'Call 108 Ambulance';
  dict['emergency.dial112'] = lang === 'Telugu' ? '112 జాతీయ అత్యవసరం' : lang === 'Hindi' ? '112 राष्ट्रीय आपातकाल' : 'Dial 112 National Emergency';
  dict['emergency.locationShare'] = lang === 'Telugu' ? 'నా అత్యవసర లొకేషన్ షేర్ చేయండి' : lang === 'Hindi' ? 'मेरी आपातकालीन लोकेशन साझा करें' : 'Share My Emergency Location';
  dict['emergency.nearbyHospitals'] = lang === 'Telugu' ? 'సమీపంలోని 24/7 అత్యవసర ఆసుపత్రులు' : lang === 'Hindi' ? 'नजदीकी 24/7 आपातकालीन अस्पताल' : 'Nearby 24/7 Emergency Hospitals';
  dict['emergency.firstAidGuides'] = lang === 'Telugu' ? 'అత్యవసర ప్రథమ చికిత్స మార్గదర్శకాలు' : lang === 'Hindi' ? 'आपातकालीन प्राथमिक चिकित्सा निर्देश' : 'Emergency First Aid Protocols';
  dict['emergency.cprGuide'] = lang === 'Telugu' ? 'CPR (గుండె ఆగినప్పుడు చేసే ప్రక్రియ)' : lang === 'Hindi' ? 'सीपीआर (CPR) जीवन रक्षक विधि' : 'CPR Life-Saving Technique';
  dict['emergency.strokeFast'] = lang === 'Telugu' ? 'పక్షవాతం FAST గుర్తింపు' : lang === 'Hindi' ? 'स्ट्रोक FAST पहचान' : 'Stroke FAST Identification';
  dict['emergency.heartAttack'] = lang === 'Telugu' ? 'గుండెపోటు తక్షణ చర్యలు' : lang === 'Hindi' ? 'हार्ट अटैक त्वरित प्रतिक्रिया' : 'Heart Attack Immediate Protocol';
  dict['emergency.snakeBite'] = lang === 'Telugu' ? 'పాము కాటు - చేయవలసినవి, చేయకూడనివి' : lang === 'Hindi' ? 'सर्पदंश - क्या करें और क्या न करें' : 'Snakebite Dos and Don’ts';
  dict['emergency.notDispatchedNotice'] = lang === 'Telugu' ? 'గమనిక: అంబులెన్స్ పంపడం కొరకు నేరుగా 108 లేదా సంబంధిత నంబర్‌కు మాట్లాడండి.' : lang === 'Hindi' ? 'सूचना: एम्बुलेंस प्रेषण की पुष्टि सीधे 108 या संबंधित नंबर से कॉल करके प्राप्त करें।' : 'Notice: An ambulance is dispatched only after confirmed direct telephonic connection with the 108 carrier.';

  // MODULE 4: SMART MEDICINE REMINDER
  dict['meds.pageTitle'] = lang === 'Telugu' ? 'స్మార్ట్ మందుల రిమైండర్ & హిస్టరీ' : lang === 'Hindi' ? 'स्मार्ट दवा रिमाइंडर एवं इतिहास' : 'Smart Medicine Reminder';
  dict['meds.pageSubtitle'] = lang === 'Telugu' ? 'డాక్టర్ సూచించిన మందుల వేళలు, తీసుకున్న స్థితి, రీఫిల్ అలర్ట్‌లు మరియు ట్రాకింగ్.' : lang === 'Hindi' ? 'डॉक्टर द्वारा निर्धारित खुराक, दैनिक ट्रैकिंग, रीफिल अलर्ट और इतिहास।' : 'Doctor-prescribed dosage schedules, taken/skipped tracking, refill alerts, and daily history.';
  dict['meds.addMedicine'] = lang === 'Telugu' ? 'కొత్త మందును జోడించండి' : lang === 'Hindi' ? 'नई दवा जोड़ें' : 'Add Prescribed Medicine';
  dict['meds.medicineName'] = lang === 'Telugu' ? 'మందు పేరు' : lang === 'Hindi' ? 'दवा का नाम' : 'Medicine Name';
  dict['meds.dosage'] = lang === 'Telugu' ? 'మోతాదు (ఉదా: 500 mg, 1 మాత్ర)' : lang === 'Hindi' ? 'खुराक (उदा: 500 mg, 1 गोली)' : 'Dosage (e.g. 500 mg, 1 tablet)';
  dict['meds.prescribedSchedule'] = lang === 'Telugu' ? 'సూచించిన వేళలు' : lang === 'Hindi' ? 'निर्धारित समय' : 'Prescribed Schedule';
  dict['meds.morning'] = lang === 'Telugu' ? 'ఉదయం' : lang === 'Hindi' ? 'सुबह' : 'Morning';
  dict['meds.afternoon'] = lang === 'Telugu' ? 'మధ్యాహ్నం' : lang === 'Hindi' ? 'दोपहर' : 'Afternoon';
  dict['meds.evening'] = lang === 'Telugu' ? 'సాయంత్రం' : lang === 'Hindi' ? 'शाम' : 'Evening';
  dict['meds.night'] = lang === 'Telugu' ? 'రాత్రి' : lang === 'Hindi' ? 'रात' : 'Night';
  dict['meds.markTaken'] = lang === 'Telugu' ? 'తీసుకున్నాను' : lang === 'Hindi' ? 'दवा ली' : 'Mark Taken';
  dict['meds.markSkipped'] = lang === 'Telugu' ? 'వదిలివేశాను' : lang === 'Hindi' ? 'छोड़ दी' : 'Skip';
  dict['meds.statusTaken'] = lang === 'Telugu' ? 'తీసుకున్నారు' : lang === 'Hindi' ? 'ले ली गई' : 'Taken';
  dict['meds.statusPending'] = lang === 'Telugu' ? 'వేచి ఉంది' : lang === 'Hindi' ? 'लंबित' : 'Pending';
  dict['meds.refillAlert'] = lang === 'Telugu' ? 'రీఫిల్ అవసరం' : lang === 'Hindi' ? 'रीफिल की आवश्यकता' : 'Refill Alert';
  dict['meds.adherenceStreak'] = lang === 'Telugu' ? 'క్రమశిక్షణ స్కోరు' : lang === 'Hindi' ? 'दवा नियमबद्धता' : 'Adherence Rate';
  dict['meds.noPrescribeDisclaimer'] = lang === 'Telugu' ? 'గమనిక: ఈ వ్యవస్థ మందులను సిఫార్సు చేయదు లేదా మోతాదును మార్చదు. కేవలం మీ డాక్టర్ ప్రిస్క్రిప్షన్ ప్రకారం మాత్రమే నడుస్తుంది.' : lang === 'Hindi' ? 'नोट: यह प्रणाली केवल आपकी डॉक्टर की पर्ची के अनुसार याद दिलाती है, कोई दवा निर्धारित नहीं करती।' : 'Safety Notice: This reminder strictly tracks doctor-prescribed regimens. It never prescribes or changes dosages.';

  // MODULE 5: FAMILY HEALTH PROFILES
  dict['family.pageTitle'] = lang === 'Telugu' ? 'కుటుంబ ఆరోగ్య ప్రొఫైల్స్ & డాష్‌బోర్డ్' : lang === 'Hindi' ? 'परिवार स्वास्थ्य प्रोफाइल एवं डैशबोर्ड' : 'Family Health Profiles';
  dict['family.pageSubtitle'] = lang === 'Telugu' ? 'కుటుంబ సభ్యుల ప్రత్యేక ఆరోగ్య రికార్డులు, అపాయింట్‌మెంట్‌లు, ప్రిస్క్రిప్షన్‌లు మరియు కేర్‌గివర్ సమ్మతి.' : lang === 'Hindi' ? 'परिवार के सदस्यों के अलग-अलग स्वास्थ्य रिकॉर्ड, अपॉइंटमेंट और अधिकृत देखभालकर्ता पहुंच।' : 'Separate individual health profiles, medical records, appointments, and caregiver consent management.';
  dict['family.addMember'] = lang === 'Telugu' ? 'కుటుంబ సభ్యుడిని చేర్చండి' : lang === 'Hindi' ? 'परिवार का सदस्य जोड़ें' : 'Add Family Member';
  dict['family.relation'] = lang === 'Telugu' ? 'సంబంధం' : lang === 'Hindi' ? 'संबंध' : 'Relationship';
  dict['family.bloodGroup'] = lang === 'Telugu' ? 'రక్త వర్గం' : lang === 'Hindi' ? 'రక్తం గ్రూప్' : 'Blood Group';
  dict['family.allergies'] = lang === 'Telugu' ? 'అలర్జీలు' : lang === 'Hindi' ? 'एलर्जी' : 'Known Allergies';
  dict['family.chronicConditions'] = lang === 'Telugu' ? 'దీర్ఘకాలిక సమస్యలు' : lang === 'Hindi' ? 'पुरानी बीमारियां' : 'Chronic Conditions';
  dict['family.caregiverConsent'] = lang === 'Telugu' ? 'కేర్‌గివర్ సమ్మతి స్థాయి' : lang === 'Hindi' ? 'देखभालकर्ता सहमति स्तर' : 'Caregiver Consent Level';
  dict['family.dpdpNotice'] = lang === 'Telugu' ? 'డిజిటల్ పర్సనల్ డేటా ప్రొటెక్షన్ (DPDP) చట్టం ప్రకారం ప్రతి సభ్యుని రికార్డులు గోప్యంగా ఉంటాయి.' : lang === 'Hindi' ? 'डीपीडीपी अधिनियम के तहत प्रत्येक सदस्य का व्यक्तिगत रिकॉर्ड पूरी तरह सुरक्षित और गोपनीय है।' : 'All family member records are maintained separately and protected under the DPDP Act.';
};

augmentWithAliases(translations.English, 'English');
augmentWithAliases(translations.Telugu, 'Telugu');
augmentWithAliases(translations.Hindi, 'Hindi');
