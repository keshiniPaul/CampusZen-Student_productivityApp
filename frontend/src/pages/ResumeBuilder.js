import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import campusLogo from '../images/campus_logo.png';
import './ResumeBuilder.css';

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const resumeRef = useRef(null);
  
  // Resume list state
  const [resumes, setResumes] = useState([]);
  const [showDashboard, setShowDashboard] = useState(true);
  const [currentResumeId, setCurrentResumeId] = useState(null);
  const [resumeName, setResumeName] = useState('My Resume');

  // Resume data state
  const [personal, setPersonal] = useState({ fullName: '', email: '', phone: '', linkedin: '', address: '' });
  const [objective, setObjective] = useState('');
  const [education, setEducation] = useState([{ id: Date.now(), degree: '', university: '', gpa: '', year: '' }]);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [projects, setProjects] = useState([{ id: Date.now(), title: '', description: '', link: '' }]);
  const [experience, setExperience] = useState([{ id: Date.now(), role: '', company: '', duration: '', description: '' }]);
  const [certifications, setCertifications] = useState([{ id: Date.now(), name: '', date: '' }]);
  const [extracurricular, setExtracurricular] = useState([{ id: Date.now(), activity: '', description: '' }]);
  const [references, setReferences] = useState([{ id: Date.now(), name: '', contact: '' }]);

  // active section for form
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);

  const API_URL = "http://localhost:5000/api/resumes";
  const token = localStorage.getItem('token');

  const requestJson = async (url, options = {}) => {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }

    return response.json();
  };

  useEffect(() => {
    fetchResumes();
    // Auto-fill personal details from user profile for new resumes
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setPersonal(prev => ({
        ...prev,
        fullName: user.name || user.firstName + (user.lastName ? ' ' + user.lastName : '') || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
    // Intentionally run once on mount to initialize dashboard data and profile defaults.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchResumes = async () => {
    try {
      const data = await requestJson(`${API_URL}/my-resumes`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });
      setResumes(data);
    } catch (err) {
      console.error("Error fetching resumes", err);
    }
  };

  const loadResume = (resume) => {
    setCurrentResumeId(resume._id);
    setResumeName(resume.resumeName);
    setPersonal(resume.personal || { fullName: '', email: '', phone: '', linkedin: '', address: '' });
    setObjective(resume.objective || '');
    setEducation(resume.education?.length ? resume.education.map(e => ({...e, id: e._id || Date.now() + Math.random()})) : [{ id: Date.now(), degree: '', university: '', gpa: '', year: '' }]);
    setSkills(resume.skills || []);
    setProjects(resume.projects?.length ? resume.projects.map(p => ({...p, id: p._id || Date.now() + Math.random()})) : [{ id: Date.now(), title: '', description: '', link: '' }]);
    setExperience(resume.experience?.length ? resume.experience.map(e => ({...e, id: e._id || Date.now() + Math.random()})) : [{ id: Date.now(), role: '', company: '', duration: '', description: '' }]);
    setCertifications(resume.certifications?.length ? resume.certifications.map(c => ({...c, id: c._id || Date.now() + Math.random()})) : [{ id: Date.now(), name: '', date: '' }]);
    setExtracurricular(resume.extracurricular?.length ? resume.extracurricular.map(e => ({...e, id: e._id || Date.now() + Math.random()})) : [{ id: Date.now(), activity: '', description: '' }]);
    setReferences(resume.references?.length ? resume.references.map(r => ({...r, id: r._id || Date.now() + Math.random()})) : [{ id: Date.now(), name: '', contact: '' }]);
    setShowDashboard(false);
  };

  const createNewResume = () => {
    setCurrentResumeId(null);
    setResumeName('New Resume');
    // Keep personal info from profile but clear others
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setPersonal({
        fullName: user.name || user.firstName + (user.lastName ? ' ' + user.lastName : '') || '',
        email: user.email || '',
        phone: user.phone || '',
        linkedin: '',
        address: ''
      });
    } else {
      setPersonal({ fullName: '', email: '', phone: '', linkedin: '', address: '' });
    }
    setObjective('');
    setEducation([{ id: Date.now(), degree: '', university: '', gpa: '', year: '' }]);
    setSkills([]);
    setProjects([{ id: Date.now(), title: '', description: '', link: '' }]);
    setExperience([{ id: Date.now(), role: '', company: '', duration: '', description: '' }]);
    setCertifications([{ id: Date.now(), name: '', date: '' }]);
    setExtracurricular([{ id: Date.now(), activity: '', description: '' }]);
    setReferences([{ id: Date.now(), name: '', contact: '' }]);
    setShowDashboard(false);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    const resumeData = {
      id: currentResumeId,
      resumeName,
      personal,
      objective,
      education,
      skills,
      projects,
      experience,
      certifications,
      extracurricular,
      references
    };

    try {
      const data = await requestJson(`${API_URL}/save`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData)
      });
      if (!currentResumeId) {
        setCurrentResumeId(data._id);
      }
      fetchResumes();
      alert("Draft saved successfully!");
    } catch (err) {
      console.error("Error saving resume", err);
      alert("Failed to save draft.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteResume = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      await requestJson(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchResumes();
    } catch (err) {
      console.error("Error deleting resume", err);
    }
  };

  const handleDownloadPDF = () => {
    const element = resumeRef.current;
    if (!element) return;
    const opt = {
      margin: [0.3, 0],
      filename: `${personal.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const addField = (setter, emptyObj) => {
    setter(prev => [...prev, { id: Date.now() + Math.random(), ...emptyObj }]);
  };

  const removeField = (id, setter) => {
    setter(prev => prev.filter(item => item.id !== id));
  };

  const updateField = (id, field, value, setter) => {
    setter(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills(prev => [...prev, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (sk) => {
    setSkills(prev => prev.filter(s => s !== sk));
  };

  return (
    <div className="resume-builder-page">
      {/* Header */}
      <header className="resume-header">
        <div className="resume-brand" onClick={() => navigate('/career')}>
          <img src={campusLogo} alt="CampusZone Logo" />
          <span>Resume Builder</span>
        </div>
        <div className="resume-header-actions">
          {!showDashboard && (
            <>
              <input 
                className="resume-name-input" 
                value={resumeName} 
                onChange={(e) => setResumeName(e.target.value)} 
                title="Edit Resume Name"
              />
              <button className="resume-btn-secondary" onClick={() => setShowDashboard(true)}>My Resumes</button>
              <button className="resume-btn-secondary" onClick={handleSaveDraft} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Draft"}
              </button>
            </>
          )}
          {showDashboard ? (
            <button className="resume-btn-primary" onClick={createNewResume}>+ Create New</button>
          ) : (
            <button className="resume-btn-primary" onClick={handleDownloadPDF}>Download PDF</button>
          )}
        </div>
      </header>

      {showDashboard ? (
        <div className="resume-dashboard">
          <div className="container">
            <div className="resume-dashboard-header">
              <h2>My Resumes</h2>
              <p>Manage your saved drafts or create a new one.</p>
            </div>
            
            <div className="resume-list">
              {resumes.length === 0 ? (
                <div className="resume-empty">
                  <div className="resume-empty-icon">📄</div>
                  <p>You haven't saved any resumes yet.</p>
                  <button className="resume-btn-primary" onClick={createNewResume}>Build Your First Resume</button>
                </div>
              ) : (
                <div className="resume-grid">
                  {resumes.map(resume => (
                    <div key={resume._id} className="resume-card" onClick={() => loadResume(resume)}>
                      <div className="resume-card-icon">📄</div>
                      <div className="resume-card-info">
                        <h3>{resume.resumeName}</h3>
                        <p>Last updated: {new Date(resume.updatedAt).toLocaleDateString()}</p>
                      </div>
                      <button className="resume-card-delete" onClick={(e) => deleteResume(resume._id, e)}>Delete</button>
                    </div>
                  ))}
                  <div className="resume-card resume-card-new" onClick={createNewResume}>
                    <div className="resume-card-icon">+</div>
                    <h3>New Resume</h3>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="resume-container">
          {/* Left Side: Editor Form */}
          <div className="resume-editor">
            <div className="resume-tabs">
              {['personal', 'objective', 'education', 'skills', 'projects', 'experience', 'certifications', 'extracurricular', 'references'].map(tab => (
                <button 
                  key={tab} 
                  className={`resume-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="resume-form-content">
              {activeTab === 'personal' && (
                <div className="resume-section-form">
                  <h3>Personal Information</h3>
                  <div className="resume-form-item"><label>Full Name</label><input placeholder="Full Name" value={personal.fullName} onChange={e => setPersonal({...personal, fullName: e.target.value})} /></div>
                  <div className="resume-form-item"><label>Email Address</label><input placeholder="Email Address" value={personal.email} onChange={e => setPersonal({...personal, email: e.target.value})} /></div>
                  <div className="resume-form-item"><label>Phone Number</label><input placeholder="Phone Number" value={personal.phone} onChange={e => setPersonal({...personal, phone: e.target.value})} /></div>
                  <div className="resume-form-item"><label>LinkedIn / Portfolio</label><input placeholder="LinkedIn / Portfolio" value={personal.linkedin} onChange={e => setPersonal({...personal, linkedin: e.target.value})} /></div>
                  <div className="resume-form-item"><label>Address / Location</label><input placeholder="Address / Location" value={personal.address} onChange={e => setPersonal({...personal, address: e.target.value})} /></div>
                </div>
              )}

              {activeTab === 'objective' && (
                <div className="resume-section-form">
                  <h3>Career Objective</h3>
                  <textarea rows="5" placeholder="Write a brief professional summary..." value={objective} onChange={e => setObjective(e.target.value)}></textarea>
                </div>
              )}

              {activeTab === 'education' && (
                <div className="resume-section-form">
                  <h3>Education</h3>
                  {education.map((edu, idx) => (
                    <div key={edu.id} className="resume-field-group">
                      <input placeholder="Degree (e.g. BSc Computer Science)" value={edu.degree} onChange={e => updateField(edu.id, 'degree', e.target.value, setEducation)} />
                      <input placeholder="University / Institution" value={edu.university} onChange={e => updateField(edu.id, 'university', e.target.value, setEducation)} />
                      <div className="resume-row">
                        <input placeholder="GPA / Grade" value={edu.gpa} onChange={e => updateField(edu.id, 'gpa', e.target.value, setEducation)} />
                        <input placeholder="Year (e.g. 2020 - 2024)" value={edu.year} onChange={e => updateField(edu.id, 'year', e.target.value, setEducation)} />
                      </div>
                      <button className="resume-btn-delete" onClick={() => removeField(edu.id, setEducation)}>Remove</button>
                    </div>
                  ))}
                  <button className="resume-btn-add" onClick={() => addField(setEducation, {degree:'', university:'', gpa:'', year:''})}>+ Add Education</button>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="resume-section-form">
                  <h3>Skills</h3>
                  <form onSubmit={handleAddSkill} className="resume-skill-form">
                    <input placeholder="Type a skill and press Enter" value={skillInput} onChange={e => setSkillInput(e.target.value)} />
                    <button type="submit">Add</button>
                  </form>
                  <div className="resume-skill-tags">
                    {skills.map(sk => (
                      <span key={sk} className="resume-skill-tag">{sk} <button onClick={() => removeSkill(sk)}>×</button></span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="resume-section-form">
                  <h3>Projects</h3>
                  {projects.map((proj) => (
                    <div key={proj.id} className="resume-field-group">
                      <input placeholder="Project Title" value={proj.title} onChange={e => updateField(proj.id, 'title', e.target.value, setProjects)} />
                      <input placeholder="Link (Optional)" value={proj.link} onChange={e => updateField(proj.id, 'link', e.target.value, setProjects)} />
                      <textarea rows="3" placeholder="Description & Technologies used" value={proj.description} onChange={e => updateField(proj.id, 'description', e.target.value, setProjects)}></textarea>
                      <button className="resume-btn-delete" onClick={() => removeField(proj.id, setProjects)}>Remove</button>
                    </div>
                  ))}
                  <button className="resume-btn-add" onClick={() => addField(setProjects, {title:'', description:'', link:''})}>+ Add Project</button>
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="resume-section-form">
                  <h3>Work Experience</h3>
                  {experience.map((exp) => (
                    <div key={exp.id} className="resume-field-group">
                      <input placeholder="Role / Job Title" value={exp.role} onChange={e => updateField(exp.id, 'role', e.target.value, setExperience)} />
                      <input placeholder="Company Name" value={exp.company} onChange={e => updateField(exp.id, 'company', e.target.value, setExperience)} />
                      <input placeholder="Duration (e.g. Jun 2022 - Aug 2022)" value={exp.duration} onChange={e => updateField(exp.id, 'duration', e.target.value, setExperience)} />
                      <textarea rows="3" placeholder="Responsibilities and Achievements" value={exp.description} onChange={e => updateField(exp.id, 'description', e.target.value, setExperience)}></textarea>
                      <button className="resume-btn-delete" onClick={() => removeField(exp.id, setExperience)}>Remove</button>
                    </div>
                  ))}
                  <button className="resume-btn-add" onClick={() => addField(setExperience, {role:'', company:'', duration:'', description:''})}>+ Add Experience</button>
                </div>
              )}

              {activeTab === 'certifications' && (
                <div className="resume-section-form">
                  <h3>Certifications</h3>
                  {certifications.map((cert) => (
                    <div key={cert.id} className="resume-field-group">
                      <input placeholder="Certification Name" value={cert.name} onChange={e => updateField(cert.id, 'name', e.target.value, setCertifications)} />
                      <input placeholder="Date / Issuer" value={cert.date} onChange={e => updateField(cert.id, 'date', e.target.value, setCertifications)} />
                      <button className="resume-btn-delete" onClick={() => removeField(cert.id, setCertifications)}>Remove</button>
                    </div>
                  ))}
                  <button className="resume-btn-add" onClick={() => addField(setCertifications, {name:'', date:''})}>+ Add Certification</button>
                </div>
              )}

              {activeTab === 'extracurricular' && (
                <div className="resume-section-form">
                  <h3>Extracurricular Activities</h3>
                  {extracurricular.map((extra) => (
                    <div key={extra.id} className="resume-field-group">
                      <input placeholder="Activity / Role" value={extra.activity} onChange={e => updateField(extra.id, 'activity', e.target.value, setExtracurricular)} />
                      <textarea rows="2" placeholder="Description" value={extra.description} onChange={e => updateField(extra.id, 'description', e.target.value, setExtracurricular)}></textarea>
                      <button className="resume-btn-delete" onClick={() => removeField(extra.id, setExtracurricular)}>Remove</button>
                    </div>
                  ))}
                  <button className="resume-btn-add" onClick={() => addField(setExtracurricular, {activity:'', description:''})}>+ Add Activity</button>
                </div>
              )}

              {activeTab === 'references' && (
                <div className="resume-section-form">
                  <h3>References</h3>
                  {references.map((ref) => (
                    <div key={ref.id} className="resume-field-group">
                      <input placeholder="Name & Title" value={ref.name} onChange={e => updateField(ref.id, 'name', e.target.value, setReferences)} />
                      <input placeholder="Contact Info" value={ref.contact} onChange={e => updateField(ref.id, 'contact', e.target.value, setReferences)} />
                      <button className="resume-btn-delete" onClick={() => removeField(ref.id, setReferences)}>Remove</button>
                    </div>
                  ))}
                  <button className="resume-btn-add" onClick={() => addField(setReferences, {name:'', contact:''})}>+ Add Reference</button>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Resume Preview */}
          <div className="resume-preview-wrapper">
            <div className="resume-preview" ref={resumeRef}>
              
              <div className="cv-header">
                <h1 className="cv-name">{personal.fullName || 'Your Name'}</h1>
                <div className="cv-contact">
                  {personal.email && <span>{personal.email}</span>}
                  {personal.phone && <span> | {personal.phone}</span>}
                  {personal.address && <span> | {personal.address}</span>}
                  {personal.linkedin && <span> | {personal.linkedin}</span>}
                </div>
              </div>

              {objective && (
                <div className="cv-section">
                  <h2 className="cv-section-title">Objective</h2>
                  <div className="cv-section-content">
                    <p>{objective}</p>
                  </div>
                </div>
              )}

              {education.length > 0 && education[0].degree && (
                <div className="cv-section">
                  <h2 className="cv-section-title">Education</h2>
                  <div className="cv-section-content">
                    {education.map(edu => edu.degree && (
                      <div key={edu.id} className="cv-item">
                        <div className="cv-item-header">
                          <strong>{edu.degree}</strong>
                          <span>{edu.year}</span>
                        </div>
                        <div className="cv-item-subheader">{edu.university} {edu.gpa && `- GPA: ${edu.gpa}`}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {experience.length > 0 && experience[0].role && (
                <div className="cv-section">
                  <h2 className="cv-section-title">Work Experience</h2>
                  <div className="cv-section-content">
                    {experience.map(exp => exp.role && (
                      <div key={exp.id} className="cv-item">
                        <div className="cv-item-header">
                          <strong>{exp.role}</strong>
                          <span>{exp.duration}</span>
                        </div>
                        <div className="cv-item-subheader">{exp.company}</div>
                        <p className="cv-item-desc">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {projects.length > 0 && projects[0].title && (
                <div className="cv-section">
                  <h2 className="cv-section-title">Projects</h2>
                  <div className="cv-section-content">
                    {projects.map(proj => proj.title && (
                      <div key={proj.id} className="cv-item">
                        <div className="cv-item-header">
                          <strong>{proj.title} {proj.link && <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer" style={{fontSize: '0.85em', fontWeight: 'normal'}}>[Link]</a>}</strong>
                        </div>
                        <p className="cv-item-desc">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {skills.length > 0 && (
                <div className="cv-section">
                  <h2 className="cv-section-title">Skills</h2>
                  <div className="cv-section-content">
                    <p className="cv-skills-list">{skills.join(' • ')}</p>
                  </div>
                </div>
              )}

              {certifications.length > 0 && certifications[0].name && (
                <div className="cv-section">
                  <h2 className="cv-section-title">Certifications</h2>
                  <div className="cv-section-content">
                    <ul className="cv-list">
                      {certifications.map(cert => cert.name && (
                        <li key={cert.id}><strong>{cert.name}</strong> {cert.date && `- ${cert.date}`}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {extracurricular.length > 0 && extracurricular[0].activity && (
                <div className="cv-section">
                  <h2 className="cv-section-title">Extracurricular Activities</h2>
                  <div className="cv-section-content">
                    {extracurricular.map(extra => extra.activity && (
                      <div key={extra.id} className="cv-item">
                        <strong>{extra.activity}</strong>
                        <p className="cv-item-desc">{extra.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {references.length > 0 && references[0].name && (
                <div className="cv-section cv-section-pagebreak">
                  <h2 className="cv-section-title">References</h2>
                  <div className="cv-section-content">
                    <ul className="cv-list">
                      {references.map(ref => ref.name && (
                        <li key={ref.id}><strong>{ref.name}</strong> {ref.contact && `- ${ref.contact}`}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
