export interface SpecializationInfo {
  id: string;
  name: string;
  teluguName: string;
  hindiName: string;
  category: 'General' | 'Surgical' | 'Internal Medicine' | 'Pediatrics' | 'Women' | 'Super Specialty' | 'Diagnostic';
  description: string;
  symptoms: string[];
  commonConditions: string[];
  recommendedDepartment: string;
  iconName: string;
}

export const SPECIALIZATIONS_DIRECTORY: SpecializationInfo[] = [
  {
    id: 'general-medicine',
    name: 'General Medicine',
    teluguName: 'జనరల్ మెడిసిన్',
    hindiName: 'सामान्य चिकित्सा',
    category: 'General',
    description: 'First line of diagnosis, treatment of chronic diseases, acute infections, lifestyle disorders, and routine health evaluations.',
    symptoms: ['Fever', 'Fatigue', 'Body Ache', 'Weakness', 'Unexplained Weight Loss', 'Mild Infections', 'Chills', 'Cough', 'Cold'],
    commonConditions: ['Typhoid', 'Malaria', 'Dengue', 'Viral Fever', 'Hypertension', 'Type 2 Diabetes', 'Anemia', 'Infection'],
    recommendedDepartment: 'General Medicine',
    iconName: 'Stethoscope'
  },
  {
    id: 'cardiology',
    name: 'Cardiology',
    teluguName: 'గుండె చికిత్స (కార్డియాలజీ)',
    hindiName: 'हृदय रोग (कार्डियोलॉजी)',
    category: 'Super Specialty',
    description: 'Expert care for diseases of the cardiovascular system, coronary artery disorders, heart rhythms, and heart failure.',
    symptoms: ['Chest Pain', 'Shortness of Breath', 'Palpitations', 'High Blood Pressure', 'Dizziness', 'Leg Swelling', 'Left Arm Radiating Pain'],
    commonConditions: ['Coronary Artery Disease', 'Heart Attack', 'Arrhythmia', 'Heart Failure', 'Angina Pectoris', 'Hypertensive Heart Disease'],
    recommendedDepartment: 'Cardiology',
    iconName: 'HeartPulse'
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    teluguName: 'ఎముకలు మరియు కీళ్ళ చికిత్స',
    hindiName: 'हड्डी एवं जोड़ रोग (ऑर्थोपेडिक्स)',
    category: 'Surgical',
    description: 'Management of bone fractures, degenerative joint diseases, sports injuries, spine disorders, and joint replacements.',
    symptoms: ['Joint Pain', 'Knee Pain', 'Back Pain', 'Fracture', 'Limited Mobility', 'Neck Stiffness', 'Swollen Joints', 'Sports Injury'],
    commonConditions: ['Osteoarthritis', 'Rheumatoid Arthritis', 'Slipped Disc', 'Bone Fractures', 'ACL Tear', 'Frozen Shoulder', 'Cervical Spondylosis'],
    recommendedDepartment: 'Orthopedics',
    iconName: 'Bone'
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics & Neonatology',
    teluguName: 'పిల్లల వైద్యం',
    hindiName: 'बाल रोग एवं नवजात शिशु देखभाल',
    category: 'Pediatrics',
    description: 'Comprehensive medical care for infants, children, and adolescents, including immunization, developmental milestones, and acute illnesses.',
    symptoms: ['Childhood Fever', 'Persistent Cough in Children', 'Vomiting in Infants', 'Skin Rash in Children', 'Growth Delay', 'Loss of Appetite'],
    commonConditions: ['Neonatal Jaundice', 'Pediatric Asthma', 'Bronchiolitis', 'Measles', 'Mumps', 'Childhood Infections', 'Malnutrition'],
    recommendedDepartment: 'Pediatrics',
    iconName: 'Baby'
  },
  {
    id: 'neurology',
    name: 'Neurology',
    teluguName: 'నాడీ మండలం (న్యూరాలజీ)',
    hindiName: 'तंत्रिका रोग (न्यूरोलॉजी)',
    category: 'Super Specialty',
    description: 'Diagnosis and medical treatment of disorders affecting the brain, spinal cord, peripheral nerves, and neuromuscular junctions.',
    symptoms: ['Severe Headache', 'Migraine', 'Seizures', 'Numbness or Tingling', 'Loss of Balance', 'Memory Loss', 'Facial Droop', 'Tremors'],
    commonConditions: ['Stroke (Brain Attack)', 'Epilepsy', 'Parkinson’s Disease', 'Multiple Sclerosis', 'Peripheral Neuropathy', 'Alzheimer’s'],
    recommendedDepartment: 'Neurology',
    iconName: 'Brain'
  },
  {
    id: 'gastroenterology',
    name: 'Gastroenterology',
    teluguName: 'జీర్ణకోశ వ్యాధులు (గ్యాస్ట్రోఎంటరాలజీ)',
    hindiName: 'पेट एवं पाचन रोग (गैस्ट्रोएंटरोलॉजी)',
    category: 'Super Specialty',
    description: 'Specialized diagnosis and endoscopic treatment of esophagus, stomach, intestines, liver, gallbladder, and pancreas diseases.',
    symptoms: ['Severe Stomach Pain', 'Acid Reflux / Heartburn', 'Chronic Diarrhea', 'Persistent Constipation', 'Blood in Stool', 'Jaundice', 'Bloating'],
    commonConditions: ['Gastritis', 'GERD', 'Peptic Ulcer', 'Irritable Bowel Syndrome (IBS)', 'Fatty Liver Disease', 'Liver Cirrhosis', 'Gallstones'],
    recommendedDepartment: 'Gastroenterology',
    iconName: 'Activity'
  },
  {
    id: 'obstetrics-gynecology',
    name: 'Obstetrics & Gynecology (OB-GYN)',
    teluguName: 'స్త్రీ జననేంద్రియ మరియు ప్రసూతి వైద్యం',
    hindiName: 'स्त्री एवं प्रसूति रोग',
    category: 'Women',
    description: 'Complete reproductive healthcare, pregnancy monitoring, safe deliveries, fertility support, and gynecological surgical care.',
    symptoms: ['Irregular Periods', 'Severe Pelvic Pain', 'Pregnancy Care', 'Heavy Menstrual Bleeding', 'Vaginal Discharge', 'Menopause Symptoms'],
    commonConditions: ['PCOS / PCOD', 'Endometriosis', 'Uterine Fibroids', 'High-Risk Pregnancy', 'Infertility', 'Pelvic Inflammatory Disease'],
    recommendedDepartment: 'Gynecology & Obstetrics',
    iconName: 'Users'
  },
  {
    id: 'dermatology',
    name: 'Dermatology & Venereology',
    teluguName: 'చర్మ సంబంధిత వ్యాధులు (డెర్మటాలజీ)',
    hindiName: 'त्वचा एवं सौंदर्य रोग (डर्मेटोलॉजी)',
    category: 'General',
    description: 'Diagnosis and advanced clinical management of skin, hair, and nail conditions, cosmetic dermatology, and allergic reactions.',
    symptoms: ['Severe Itching', 'Skin Rashes', 'Hair Fall', 'Acne & Scars', 'Dark Patches', 'Eczema Flare-ups', 'Psoriasis Plaques', 'Nail Fungus'],
    commonConditions: ['Atopic Dermatitis', 'Psoriasis', 'Acne Vulgaris', 'Alopecia Areata', 'Fungal Skin Infections', 'Urticaria (Hives)'],
    recommendedDepartment: 'Dermatology',
    iconName: 'Sparkles'
  },
  {
    id: 'pulmonology',
    name: 'Pulmonology & Chest Medicine',
    teluguName: 'ఊపిరితిత్తుల వైద్యం (పల్మనాలజీ)',
    hindiName: 'श्वसन एवं फेफड़ा रोग (पल्मोनोलॉजी)',
    category: 'Internal Medicine',
    description: 'Treatment of respiratory disorders, chronic lung conditions, sleep apnea, and infectious pulmonary conditions including tuberculosis.',
    symptoms: ['Breathlessness', 'Chronic Wet/Dry Cough', 'Wheezing', 'Chest Tightness', 'Coughing Blood', 'Sleep Snoring / Apnea'],
    commonConditions: ['Bronchial Asthma', 'COPD', 'Pneumonia', 'Pulmonary Tuberculosis', 'Interstitial Lung Disease (ILD)', 'Pleural Effusion'],
    recommendedDepartment: 'Pulmonology',
    iconName: 'Wind'
  },
  {
    id: 'nephrology',
    name: 'Nephrology & Renal Care',
    teluguName: 'మూత్రపిండాల వైద్యం (నెఫ్రాలజీ)',
    hindiName: 'गुर्दा एवं नेफ्रोलॉजी रोग',
    category: 'Super Specialty',
    description: 'Comprehensive kidney health, hemodialysis, peritoneal dialysis, electrolyte management, and kidney transplant care.',
    symptoms: ['Decreased Urine Output', 'Swelling in Feet/Face', 'Blood in Urine', 'Foamy Urine', 'Severe Fatigue', 'Uncontrolled Hypertension'],
    commonConditions: ['Chronic Kidney Disease (CKD)', 'Acute Kidney Injury', 'Nephrotic Syndrome', 'Diabetic Nephropathy', 'Kidney Failure'],
    recommendedDepartment: 'Nephrology',
    iconName: 'Filter'
  },
  {
    id: 'urology',
    name: 'Urology & Andrology',
    teluguName: 'యూరాలజీ (యూరినరీ మరియు పురుషుల ఆరోగ్యం)',
    hindiName: 'मूत्र रोग एवं यूरोलॉजी',
    category: 'Surgical',
    description: 'Surgical subspecialty managing the urinary tract system for both genders and male reproductive disorders.',
    symptoms: ['Burning Sensation Urinating', 'Difficulty Urinating', 'Severe Flank Pain', 'Blood in Urine', 'Frequent Urination at Night'],
    commonConditions: ['Kidney Stones', 'Benign Prostatic Hyperplasia (BPH)', 'Urinary Tract Infection (UTI)', 'Bladder Stones', 'Erectile Dysfunction'],
    recommendedDepartment: 'Urology',
    iconName: 'ShieldAlert'
  },
  {
    id: 'ent',
    name: 'ENT (Otorhinolaryngology)',
    teluguName: 'చెవి, ముక్కు, గొంతు (ఈఎన్టీ)',
    hindiName: 'कान, नाक एवं गला रोग (ईएनटी)',
    category: 'Surgical',
    description: 'Comprehensive care for ear disorders, sinus problems, nasal obstructions, voice issues, and head and neck growths.',
    symptoms: ['Ear Pain', 'Hearing Loss', 'Ringing in Ears (Tinnitus)', 'Sinus Congestion', 'Chronic Sore Throat', 'Nosebleed', 'Voice Hoarseness'],
    commonConditions: ['Otitis Media', 'Chronic Sinusitis', 'Deviated Nasal Septum (DNS)', 'Tonsillitis', 'Vertigo / Menieres Disease', 'Vocal Nodules'],
    recommendedDepartment: 'ENT',
    iconName: 'Ear'
  },
  {
    id: 'ophthalmology',
    name: 'Ophthalmology & Eye Care',
    teluguName: 'కంటి వైద్యం (ఆప్తాల్మాలజీ)',
    hindiName: 'नेत्र रोग (ऑप्थल्मोलॉजी)',
    category: 'Surgical',
    description: 'Visual health, cataract surgery, glaucoma detection, diabetic retinopathy, cornea care, and laser vision correction.',
    symptoms: ['Blurred Vision', 'Eye Pain', 'Red Eyes', 'Floaters or Flashes', 'Double Vision', 'Watering Eyes', 'Sudden Vision Loss'],
    commonConditions: ['Cataract', 'Glaucoma', 'Diabetic Retinopathy', 'Conjunctivitis (Pink Eye)', 'Dry Eye Syndrome', 'Refractive Errors'],
    recommendedDepartment: 'Ophthalmology',
    iconName: 'Eye'
  },
  {
    id: 'psychiatry',
    name: 'Psychiatry & Behavioral Health',
    teluguName: 'మానసిక ఆరోగ్యం (సైకియాట్రీ)',
    hindiName: 'मानसिक स्वास्थ्य एवं मनोचिकित्सा',
    category: 'General',
    description: 'Compassionate medical care for emotional, mental, and behavioral well-being, mood disorders, anxiety, and addiction recovery.',
    symptoms: ['Persistent Sadness', 'Severe Anxiety / Panic', 'Insomnia / Sleep Disorders', 'Extreme Mood Swings', 'Hallucinations', 'Substance Dependence'],
    commonConditions: ['Major Depressive Disorder', 'Generalized Anxiety Disorder', 'Bipolar Disorder', 'Schizophrenia', 'OCD', 'PTSD', 'ADHD'],
    recommendedDepartment: 'Psychiatry',
    iconName: 'Smile'
  },
  {
    id: 'endocrinology',
    name: 'Endocrinology & Diabetology',
    teluguName: 'హార్మోన్లు మరియు డయాబెటిస్ వైద్యం',
    hindiName: 'हार्मोन एवं मधुमेह रोग (एंडोक्राइनोलॉजी)',
    category: 'Internal Medicine',
    description: 'Specialized hormone balancing, advanced diabetes management, thyroid disorders, pituitary, and metabolic diseases.',
    symptoms: ['Extreme Thirst', 'Frequent Urination', 'Unexplained Weight Gain/Loss', 'Excessive Sweating or Cold Intolerance', 'Goiter / Neck Swelling'],
    commonConditions: ['Type 1 & 2 Diabetes', 'Hypothyroidism', 'Hyperthyroidism', 'Hashimoto’s Disease', 'Adrenal Insufficiency', 'Osteoporosis'],
    recommendedDepartment: 'Endocrinology',
    iconName: 'Gauge'
  },
  {
    id: 'oncology',
    name: 'Medical & Surgical Oncology',
    teluguName: 'క్యాన్సర్ చికిత్స (ఆంకాలజీ)',
    hindiName: 'कैंसर एवं ट्यूमर चिकित्सा (ऑन्कोलॉजी)',
    category: 'Super Specialty',
    description: 'Comprehensive cancer detection, surgical tumor resection, chemotherapy, immunotherapy, and targeted molecular therapies.',
    symptoms: ['Unexplained Lump or Mass', 'Drastic Unintentional Weight Loss', 'Persistent Night Sweats', 'Non-healing Ulcers', 'Abnormal Bleeding'],
    commonConditions: ['Breast Cancer', 'Lung Cancer', 'Oral Cancer', 'Cervical Cancer', 'Colorectal Cancer', 'Lymphoma', 'Leukemia'],
    recommendedDepartment: 'Oncology',
    iconName: 'Shield'
  },
  {
    id: 'emergency-medicine',
    name: 'Emergency & Critical Care Medicine',
    teluguName: 'అత్యవసర మరియు ఇంటెన్సివ్ కేర్',
    hindiName: 'आपातकालीन एवं गहन चिकित्सा',
    category: 'Super Specialty',
    description: 'Round-the-clock rapid resuscitation, acute trauma triage, intensive care unit (ICU) stabilization, and disaster medicine.',
    symptoms: ['Sudden Collapse', 'Unresponsive State', 'Severe Trauma / Road Accident', 'Massive Bleeding', 'Difficulty Breathing', 'Anaphylaxis'],
    commonConditions: ['Acute Myocardial Infarction', 'Septic Shock', 'Polytrauma', 'Acute Respiratory Distress Syndrome (ARDS)', 'Cardiac Arrest'],
    recommendedDepartment: 'Emergency & Critical Care',
    iconName: 'AlertTriangle'
  },
  {
    id: 'neurosurgery',
    name: 'Neurosurgery & Spine Surgery',
    teluguName: 'మెదడు మరియు వెన్నెముక శస్త్రచికిత్స',
    hindiName: 'न्यूरोसर्जरी एवं रीढ़ की हड्डी की सर्जरी',
    category: 'Surgical',
    description: 'Operative treatment of brain tumors, cerebral aneurysms, head injuries, spine deformities, and minimally invasive spine stabilization.',
    symptoms: ['Severe Head Injury', 'Progressive Paralysis', 'Loss of Bladder Control with Back Pain', 'Intractable Back / Sciatic Pain'],
    commonConditions: ['Brain Tumor', 'Intracranial Hemorrhage', 'Herniated Disc', 'Spinal Stenosis', 'Hydrocephalus', 'Aneurysm Rupture'],
    recommendedDepartment: 'Neurosurgery',
    iconName: 'Zap'
  },
  {
    id: 'rheumatology',
    name: 'Rheumatology & Autoimmune Care',
    teluguName: 'రుమటాలజీ (కీళ్ళు మరియు స్వయంరక్షిత వ్యాధులు)',
    hindiName: 'रुमेटोलॉजी एवं ऑटोइम्यून रोग',
    category: 'Internal Medicine',
    description: 'Diagnosis and biologics treatment for systemic autoimmune disorders, connective tissue diseases, and chronic inflammatory arthritis.',
    symptoms: ['Morning Joint Stiffness > 1 hour', 'Symmetrical Joint Swelling', 'Butterfly Facial Rash', 'Unexplained Chronic Low-grade Fever'],
    commonConditions: ['Rheumatoid Arthritis', 'Systemic Lupus Erythematosus (SLE)', 'Ankylosing Spondylitis', 'Psoriatic Arthritis', 'Gout', 'Sjogren’s'],
    recommendedDepartment: 'Rheumatology',
    iconName: 'Flame'
  },
  {
    id: 'dermatology-trichology',
    name: 'Trichology & Hair Restoration',
    teluguName: 'జుట్టు మరియు స్కాల్ప్ చికిత్స',
    hindiName: 'बाल एवं स्कैल्प चिकित्सा',
    category: 'General',
    description: 'Scientific assessment of hair thinning, male/female pattern baldness, scalp infections, and hair restoration therapies.',
    symptoms: ['Excessive Hair Fall', 'Receding Hairline', 'Patchy Hair Loss', 'Severe Dandruff / Scalp Itching', 'Scalp Pustules'],
    commonConditions: ['Androgenetic Alopecia', 'Telogen Effluvium', 'Seborrheic Dermatitis', 'Tinea Capitis', 'Traction Alopecia'],
    recommendedDepartment: 'Dermatology',
    iconName: 'Sparkles'
  },
  {
    id: 'general-surgery',
    name: 'General & Laparoscopic Surgery',
    teluguName: 'సాధారణ మరియు లాపరోస్కోపిక్ శస్త్రచికిత్స',
    hindiName: 'सामान्य एवं लेप्रोस्कोपिक सर्जरी',
    category: 'Surgical',
    description: 'Minimally invasive keyhole surgeries, emergency appendectomies, gallbladder removals, hernia repairs, and wound reconstructions.',
    symptoms: ['Right Lower Abdominal Pain', 'Bulge in Groin or Abdomen', 'Painful Anal Swelling', 'Sudden Abdominal Rigidity'],
    commonConditions: ['Acute Appendicitis', 'Inguinal / Umbilical Hernia', 'Cholecystitis', 'Hemorrhoids (Piles)', 'Anal Fistula & Fissure'],
    recommendedDepartment: 'General Surgery',
    iconName: 'Scissors'
  },
  {
    id: 'dental-maxillofacial',
    name: 'Dental & Maxillofacial Surgery',
    teluguName: 'దంత వైద్యం మరియు ముఖ శస్త్రచికిత్స',
    hindiName: 'दंत रोग एवं मैक्सिलोफेशियल सर्जरी',
    category: 'Surgical',
    description: 'Oral cavity hygiene, root canal treatments, orthodontic realignment, dental implants, and jaw reconstructive surgery.',
    symptoms: ['Severe Toothache', 'Swollen Gums / Bleeding Gums', 'Jaw Pain / Clicking Jaw', 'Wisdom Tooth Impaction', 'Broken Tooth'],
    commonConditions: ['Dental Caries (Cavities)', 'Periodontitis', 'Pulpitis', 'Impacted Wisdom Tooth', 'Temporomandibular Joint (TMJ) Disorder'],
    recommendedDepartment: 'Dentistry',
    iconName: 'Smile'
  },
  {
    id: 'plastic-reconstructive',
    name: 'Plastic & Reconstructive Surgery',
    teluguName: 'ప్లాస్టిక్ మరియు పునర్నిర్మాణ శస్త్రచికిత్స',
    hindiName: 'प्लास्टिक एवं पुनर्निर्माण सर्जरी',
    category: 'Surgical',
    description: 'Post-burn reconstruction, cleft lip and palate repair, trauma scar revision, hand surgery, and aesthetic enhancements.',
    symptoms: ['Burn Contractures', 'Facial Trauma Cuts', 'Non-healing Chronic Wounds', 'Congenital Deformities', 'Severe Tissue Loss'],
    commonConditions: ['Burn Injuries', 'Cleft Lip/Palate', 'Traumatic Soft Tissue Defects', 'Diabetic Foot Ulcers', 'Cosmetic Revision'],
    recommendedDepartment: 'Plastic Surgery',
    iconName: 'Activity'
  },
  {
    id: 'hematology',
    name: 'Clinical Hematology & Bone Marrow',
    teluguName: 'రక్త సంబంధిత వ్యాధులు (హెమటాలజీ)',
    hindiName: 'रक्त विकार एवं अस्थि मज्जा (हेमेटोलॉजी)',
    category: 'Super Specialty',
    description: 'Specialized management of blood cellular disorders, bleeding tendencies, clotting abnormalities, and hemoglobinopathies.',
    symptoms: ['Pale Skin / Conjunctiva', 'Frequent Unexplained Bruising', 'Persistent Nosebleeds', 'Enlarged Lymph Nodes', 'Severe Fatigue'],
    commonConditions: ['Thalassemia Major/Minor', 'Sickle Cell Anemia', 'Aplastic Anemia', 'Immune Thrombocytopenia (ITP)', 'Hemophilia', 'Deep Vein Thrombosis'],
    recommendedDepartment: 'Hematology',
    iconName: 'Droplet'
  },
  {
    id: 'infectious-diseases',
    name: 'Infectious Diseases & Tropical Medicine',
    teluguName: 'అంటువ్యాధులు మరియు ఉష్ణమండల వైద్యం',
    hindiName: 'संक्रामक रोग एवं उष्णकटिबंधीय चिकित्सा',
    category: 'Internal Medicine',
    description: 'Management of complex fevers, resistant bacterial infections, fungal diseases, viral epidemics, and post-travel pathogens.',
    symptoms: ['Prolonged Fever of Unknown Origin (FUO)', 'High Fever with Chills & Rigors', 'Rash with High Fever', 'Severe Diarrhea during Travel'],
    commonConditions: ['Dengue Hemorrhagic Fever', 'Chikungunya', 'Typhoid Fever', 'Malaria Falciparum/Vivax', 'Leptospirosis', 'HIV/AIDS Care', 'Scrub Typhus'],
    recommendedDepartment: 'Infectious Diseases',
    iconName: 'AlertCircle'
  },
  {
    id: 'geriatrics',
    name: 'Geriatric Medicine & Elder Care',
    teluguName: 'వృద్ధాప్య వైద్య సంరక్షణ (జెరియాట్రిక్స్)',
    hindiName: 'वृद्धावस्था चिकित्सा एवं वरिष्ठ देखभाल',
    category: 'General',
    description: 'Comprehensive healthcare addressing the complex multi-morbidity, polypharmacy, and frailty of elderly patients.',
    symptoms: ['Frequent Falls in Elderly', 'Confusion / Delirium', 'Incontinence', 'Frailty & Muscle Loss', 'Difficulty Managing Multiple Medications'],
    commonConditions: ['Dementia', 'Osteoporosis & Fall Fractures', 'Polypharmacy Interactions', 'Sarcopenia', 'Urinary Incontinence in Seniors'],
    recommendedDepartment: 'Geriatrics',
    iconName: 'HeartHandshake'
  }
];
