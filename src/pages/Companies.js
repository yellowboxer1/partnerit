import { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './css/Companies.module.css';
import icon from '../asset/icon.svg';
import header from '../asset/header.svg';
import widget from '../asset/widget1.svg';
import lnb from '../asset/LNB.svg';

  // 최초 접속 시 고유 UUID 생성
function getOrCreateUserId() {
  let id = localStorage.getItem('user_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('user_id', id);
  }
  return id;
}

const Companies = () => {
  const navigate = useNavigate();
  const userId = getOrCreateUserId();
  const [companyId, setCompanyId] = useState(null);
  const [formData, setFormData] = useState({
    representative_name: '',
    representative_gender: '',
    name: '',
    business_number: '',
    established_at: '',
    employee_count: '',
    company_type: '중소기업',
    preferred_fields: '',
    location: '부산',
    business_form: '722000'
  });

  useEffect(() => {
  const fetchCompanyData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/companies/${userId}`);
      if (!response.ok) {
        if (response.status === 404) return; // 정보 없으면 무시
        throw new Error('데이터 조회 실패');
      }
      const data = await response.json();
      setFormData({
        representative_name: data.representative_name || '',
        representative_gender: data.representative_gender || '',
        name: data.name || '',
        business_number: data.business_number || '',
        established_at: data.established_at ? data.established_at.split('T')[0] : '',
        employee_count: data.employee_count?.toString() || '',
        company_type: data.company_type || '중소기업',
        preferred_fields: data.preferred_fields || '',
        location: data.location || '부산',
        business_form: data.business_form || '722000'
      });
      setCompanyId(data.id)
    } catch (error) {
      console.error('기업 정보 불러오기 실패:', error);
    }
  };

  fetchCompanyData();
}, []);

const onGroupContainerClick = useCallback(() => {
  if (!companyId) {
    alert('기업 정보를 먼저 저장해주세요.');
    return;
  }
  navigate(`/financial/${companyId}`);
}, [navigate, companyId]);

const onGroupContainerClick2 = useCallback(() => {
  if (!companyId) {
    alert('기업 정보를 먼저 저장해주세요.');
    return;
  }
  navigate(`/projects/${companyId}`);
}, [navigate, companyId]);


  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const PreferredFieldsDropdown = ({ value, onChange, placeholder = "선택" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFields, setSelectedFields] = useState(value ? value.split(', ').filter(f => f.trim()) : []);
  
    const fieldOptions = [
      '기계 · 소재', '전기 · 전자', '정보 · 통신', '화공 · 섬유',
      '바이오 · 의료 · 생명', '에너지 · 자원', '공예 · 디자인', '기타'
    ];
  
    const handleFieldSelect = (field) => {
      let newFields;
      if (selectedFields.includes(field)) {
        newFields = selectedFields.filter(f => f !== field);
      } else {
        newFields = [...selectedFields, field];
      }
      setSelectedFields(newFields);
      onChange(newFields.join(', '));
    };
    
    const handleRemoveField = (field, e) => {
      e.stopPropagation();
      const newFields = selectedFields.filter(f => f !== field);
      setSelectedFields(newFields);
      onChange(newFields.join(', '));
    };

    return (
      <div style={{ position: 'relative', width: '100%' }}>
        <div 
          style={{ position: 'relative', width: '100%', height: '40px', cursor: 'pointer' }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div style={{
            position: 'absolute',
            height: '110%',
            width: '101.14%',
            top: '-5%',
            right: '-0.57%',
            bottom: '-5%',
            left: '-0.57%',
            borderRadius: '5.5px',
          }} />
          <div style={{
            position: 'absolute',
            height: '90%',
            width: '100%',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            borderRadius: '5px',
            backgroundColor: '#F8F9FA',
            boxSizing: 'border-box'
          }} />
          <div style={{
            position: 'absolute',
            width: 'calc(100% - 52.5px)',
            top: 'calc(50% - 12.5px)',
            left: '15.6px',
            lineHeight: '25px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            color: selectedFields.length > 0 ? '#3c82f6' : '#818181',
            fontFamily: 'var(--font-pretendard)',
            fontSize: 'var(--font-size-16)'
          }}>
            {selectedFields.length > 0 ? `${selectedFields.length}개 선택됨` : placeholder}
          </div>
        </div>
        {isOpen && (
          <div style={{
            position: 'absolute',
            top: '40px',
            left: '-2px',
            filter: 'drop-shadow(2px 4px 4px rgba(0, 0, 0, 0.15))',
            width: '350px',
            zIndex: 1000,
            backgroundColor: 'white',
            border: '1px solid #B0BEC5',
            borderRadius: '0 0 5px 5px'
          }}>
            {fieldOptions.map((field, index) => (
              <div 
                key={index}
                style={{
                  width: '318px',
                  height: '40px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #B0BEC5',
                  backgroundColor: selectedFields.includes(field) ? '#E1F5FE' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 16px',
                  zIndex: 9999,
                }}
                onClick={() => handleFieldSelect(field)}
              >
                <div style={{ color: '#666', fontSize: '15px' }}>
                  {field}
                </div>
                {selectedFields.includes(field) && (
                  <div style={{
                    marginLeft: 'auto',
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#0277BD',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px'
                  }}>
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {isOpen && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  };

  const handleGenderSelect = (gender) => {
    setFormData((prev) => ({
      ...prev,
      representative_gender: gender
    }));
    if (errors.representative_gender) {
      setErrors((prev) => ({
        ...prev,
        representative_gender: ''
      }));
    }
  };

    const handleLocationChange = (fullAddress) => {
      if (fullAddress.length >= 2) {
        const shortLocation = fullAddress.substring(0, 2); // 앞 2글자
        handleInputChange('location', shortLocation);
      }
    };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.representative_name.trim()) {
      newErrors.representative_name = '대표자명을 입력해주세요.';
    }
    if (!formData.representative_gender) {
      newErrors.representative_gender = '대표자 성별을 선택해주세요.';
    }
    if (!formData.business_number.trim()) {
      newErrors.business_number = '사업자등록번호를 입력해주세요.';
    } else if (!/^\d{3}-\d{2}-\d{5}$/.test(formData.business_number)) {
      newErrors.business_number = '올바른 사업자등록번호 형식을 입력해주세요. (예: 123-45-67890)';
    }
    if (!formData.name.trim()) {
      newErrors.name = '상호(법인명)을 입력해주세요.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveToDatabase = async (data) => {
    try {
      console.log('서버로 전송되는 데이터:', {
        representative_name: data.representative_name,
        representative_gender: data.representative_gender,
        name: data.name,
        business_number: data.business_number,
        established_at: data.established_at || null,
        employee_count: data.employee_count ? parseInt(data.employee_count) : null,
        company_type: data.company_type,
        preferred_fields: data.preferred_fields,
        location: data.location,
        business_form: data.business_form,
        user_id:userId
      });

      const response = await fetch('`${process.env.REACT_APP_API_URL}/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          representative_name: data.representative_name,
          representative_gender: data.representative_gender,
          name: data.name,
          business_number: data.business_number,
          established_at: data.established_at || null,
          employee_count: data.employee_count ? parseInt(data.employee_count) : null,
          company_type: data.company_type,
          preferred_fields: data.preferred_fields,
          location: data.location,
          business_form: data.business_form,
          user_id:userId,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '저장에 실패했습니다.');
      }

      const result = await response.json();
      console.log('저장 성공:', result);
      return result;
    } catch (error) {
      console.error('Database save error:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      const errorFields = Object.keys(errors).join(', ');
      alert(`다음 필수 항목을 입력해주세요: ${errorFields}`);
      return;
    }

    if (!formData.representative_name.trim() || !formData.name.trim() || !formData.business_number.trim()) {
      alert('대표자명, 상호명, 사업자등록번호는 필수 입력 항목입니다.');
      return;
    }

    setLoading(true);

    try {
      console.log('저장할 데이터:', formData);
      console.log('서버로 전송되는 데이터:', {
        representative_name: formData.representative_name,
        representative_gender: formData.representative_gender,
        name: formData.name,
        business_number: formData.business_number,
        established_at: formData.established_at || null,
        employee_count: formData.employee_count ? parseInt(formData.employee_count) : null,
        company_type: formData.company_type,
        preferred_fields: formData.preferred_fields,
        location: formData.location,
        business_form: formData.business_form
      });

      const result = await saveToDatabase(formData);
      console.log('서버로부터 받은 응답:', result);

      alert(`정보가 성공적으로 저장되었습니다!\n회사 ID: ${result.data?.id || 'N/A'}`);
      navigate(`/financial/${result.data?.id}`); // 재무정보 페이지로 이동
    } catch (error) {
      console.error('저장 실패:', error);
      if (error.message.includes('이미 등록된')) {
        alert('이미 등록된 사업자등록번호입니다. 다른 번호를 입력해주세요.');
      } else if (error.message.includes('네트워크')) {
        alert('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
      } else {
        alert(`저장 중 오류가 발생했습니다: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.ver2}>
      <div className={styles.div}>
        <img className={styles.child} alt="" src="Vector 573.svg" />
        <div className={styles.item} />
        <img className={styles.inner} alt="" src={icon} />
        <b className={styles.b}>이어봄</b>
        <img className={styles.vectorIcon} alt="" src="Vector.svg" />
        <div className={styles.vectorParent}>
          <img className={styles.groupChild} alt="" src="Vector 606.svg" />
          <div className={styles.wrapper}>
            <b className={styles.b1}>기본 정보</b>
          </div>
          <div className={styles.groupParent}>
            <div className={styles.parent}>
              <div className={styles.div1}>대표자명</div>
              <div className={styles.div2}>
                <input
                  type="text"
                  value={formData.representative_name}
                  onChange={(e) => handleInputChange('representative_name', e.target.value)}
                  placeholder="대표자명을 입력하세요"
                  className={styles.bg}
                  required
                  style={{
                    paddingLeft: '15.6px',
                    fontFamily: 'var(--font-pretendard)',
                    color: 'var(--color-gray-100)',
                    fontWeight: 500,
                    fontSize: 'var(--font-size-16)'
                  }}
                />
                {errors.representative_name && <span className={styles.error}>{errors.representative_name}</span>}
              </div>
              <div className={styles.div3}>대표자 성별</div>
              <div className={styles.text}>{` `}</div>
              <div className={styles.inputBasic}>
              </div>
              <div className={styles.rectangleParent} style={{ position: 'relative', zIndex: 1 }}>
                <button
                  className={`${styles.groupItem} ${formData.representative_gender === '남' ? styles.selected : ''}`}
                  onClick={() => handleGenderSelect('남')}
                  style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                >
                  <div className={styles.div4}>남</div>
                </button>
                <button
                  className={`${styles.groupInner} ${formData.representative_gender === '여' ? styles.selected : ''}`}
                  onClick={() => handleGenderSelect('여')}
                  style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                >
                  <b className={styles.b2}>여</b>
                </button>
                {errors.representative_gender && (
                  <span className={styles.error} style={{ display: 'block', marginTop: '8px' }}>
                    {errors.representative_gender}
                  </span>
                )}
              </div>
            </div>
            <div className={styles.inputBasicParent}>
              <div className={styles.inputBasic1}>
                <div className={styles.inputBasic2}>
                </div>
              </div>
              <div className={styles.div6}>상호(법인명)</div>
              <div className={styles.div7}>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="상호(법인명)을 입력하세요"
                  className={styles.bg}
                  required
                  style={{
                    paddingLeft: '15.6px',
                    fontFamily: 'var(--font-pretendard)',
                    color : 'var(--color-gray-100)',
                    fontWeight: 500,
                    fontSize: 'var(--font-size-16)'
                  }}
                />
                {errors.name && <span className={styles.error}>{errors.name}</span>}
              </div>
              <div className={styles.div8}>사업자등록번호</div>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  value={formData.business_number}
                  onChange={(e) => handleInputChange('business_number', e.target.value)}
                  placeholder="ex: 123-45-67890"
                  className={styles.bg}
                  required
                  style={{
                    paddingLeft: '15.6px',
                    fontFamily: 'var(--font-pretendard)',
                    color : 'var(--color-gray-100)',
                    fontWeight: 500,
                    fontSize: 'var(--font-size-16)'
                  }}
                />
                {errors.business_number && <span className={styles.error}>{errors.business_number}</span>}
              </div>
              <div className={styles.button}>
                <div className={styles.div9}>사업자 변경</div>
              </div>
              <div className={styles.text1}>{` `}</div>
              <div className={styles.inputBasic3}>
                <div className={styles.div11}>대분류/중분류 선택</div>
                <img className={styles.icon} alt="" src="Icon.svg" />
                <img className={styles.xcircleIcon} alt="" src="XCircle.svg" />
              </div>
            </div>
            <div className={styles.group}>
              <div className={styles.div12}>설립일자</div>
              <div className={styles.div13}>직원 수</div>
              <div className={styles.inputBasicGroup}>
                <div className={styles.inputBasic4}>
                  <div className={styles.inputBasic2}>
                    <div className={styles.bg} />
                    <input
                      type="number"
                      value={formData.employee_count}
                      onChange={(e) => handleInputChange('employee_count', e.target.value)}
                      placeholder="0"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        textAlign: 'left',
                        fontFamily: 'var(--font-pretendard)',
                        color : 'var(--color-gray-100)',
                        paddingLeft: '15.6px',
                        fontWeight: 500,
                        fontSize: 'var(--font-size-16)'
                      }}
                    />
                  </div>
                </div>
                <div className={styles.div14}>명</div>
              </div>
              <div className={styles.inputBasic6}>
                <div className={styles.bg} />
                <div className={styles.div15} style={{ position: 'relative' }}>
                  <input
                    type="date"
                    value={formData.established_at}
                    onChange={(e) => handleInputChange('established_at', e.target.value)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '25px',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontFamily: 'var(--font-pretendard)',
                      color : 'var(--color-gray-100)',
                      fontWeight: 500,
                      fontSize: 'var(--font-size-16)'
                    }}
                  />
                </div>
                <img className={styles.calendarcheckIcon} alt="" src="CalendarCheck.svg" />
              </div>
            </div>
            <div className={styles.container}>
              <div className={styles.div12}>기업분류</div>
              <div className={styles.div17}>선호분야</div>
              <div className={styles.inputBasic7}>
                <div className={styles.bg5} />
                <b className={styles.b3}>중소기업</b>
                <div className={styles.calendarcheckIcon} />
              </div>
              <img className={styles.frameIcon} alt="" src="Frame 6.svg" />
            </div>
            <div className={styles.groupContainer}>
              <div className={styles.groupDiv}>
                <div className={styles.inputBasicWrapper}>
                  <div className={styles.inputBasic8}>
                    <div className={styles.inputBasic2}>
                      <div className={styles.bg1} />
                      <div className={styles.div18}>48058</div>
                    </div>
                  </div>
                </div>
                <div className={styles.frame}>
                  <div className={styles.div19}>소재지</div>
                </div>
                <div className={styles.button1} onClick={() => {
                  const userInput = prompt("소재지를 입력하세요 (예: 부산광역시 해운대구 수영강변대로140)");
                  if (userInput) handleLocationChange(userInput);
                }}>
                  <div className={styles.div9}>소재지 변경</div>
                </div>
              </div>
              <div className={styles.inputBasic10}>
                <div className={styles.bg1} />
                <div className={styles.div5}>부산광역시 해운대구 수영강변대로140</div>
              </div>
              <div className={styles.inputBasicContainer}>
                <div className={styles.inputBasic11}>
                  <div className={styles.bg1} />
                  <div className={styles.div5}>806호(우동 부산문화콘텐츠 컴플렉스)</div>
                </div>
              </div>
            </div>
            <div className={styles.parent1}>
              <div className={styles.div23}>기업형태</div>
              <div className={styles.groupWrapper}>
                <div className={styles.inputBasic4}>
                  <div className={styles.inputBasic8}>
                    <div className={styles.inputBasic2}>
                      <div className={styles.bg1} />
                      <div className={styles.div18}>722000</div>
                    </div>
                  </div>
                  <div className={styles.button2}>
                    <div className={styles.div9}>업종 추가 / 수정</div>
                  </div>
                </div>
              </div>
              <div className={styles.inputBasicParent2}>
                <div className={styles.inputBasic14}>
                  <div className={styles.bg1} />
                  <div className={styles.div26}>정보통신업</div>
                  <img className={styles.xcircleIcon1} alt="" src="XCircle.svg" />
                </div>
                <div className={styles.inputBasic15}>
                  <div className={styles.bg1} />
                  <div className={styles.div18}>응용 소프트웨어 ...</div>
                  <img className={styles.xcircleIcon2} alt="" src="XCircle AKT

                  XCircle.svg" />
                </div>
              </div>
              <div className={styles.inputBasicParent3}>
                <div className={styles.inputBasic14}>
                  <div className={styles.bg1} />
                  <div className={styles.div26}>정보통신업</div>
                  <img className={styles.xcircleIcon1} alt="" src="XCircle.svg" />
                </div>
                <div className={styles.inputBasic15}>
                  <div className={styles.bg1} />
                  <div className={styles.div18}>응용 소프트웨어 ...</div>
                  <img className={styles.xcircleIcon2} alt="" src="XCircle.svg" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.parent2}>
          <b className={styles.b4}>기업개요</b>
          <div className={styles.rectangleDiv} />
        </div>
        <div className={styles.parent3} onClick={onGroupContainerClick}>
          <b className={styles.b4}>재무정보</b>
          <div className={styles.groupChild1} />
        </div>
        <div className={styles.parent4} onClick={onGroupContainerClick2}>
          <b className={styles.b4}>사업정보</b>
          <div className={styles.groupChild1} />
        </div>
        <div className={styles.parent5} onClick={onGroupContainerClick}>
          <b className={styles.b4}>가점정보</b>
          <div className={styles.groupChild1} />
        </div>
        <div className={styles.div30}>관리자</div>
        <div className={styles.div31}>
          <div className={styles.inputBasic18}>
            <div className={styles.bg}>
              <PreferredFieldsDropdown
                value={formData.preferred_fields}
                onChange={(value) => handleInputChange('preferred_fields', value)}
                placeholder="선택"
              />
            </div>
            <img className={styles.icon1} alt="" src={"Icon.svg"} />
          </div>
        </div>
      </div>
      <div className={styles.ver2Child} />
      <div className={styles.frameDiv}>
        <img className={styles.frameDiv1} alt="" src={widget} />
      </div>

      <div className={styles.footer}>
        <div className={styles.component13Parent}>
          <div className={styles.component13} onClick={handleSave}>
            <div className={styles.component13Child} />
            <b className={styles.b13}>
              {loading ? '저장 중...' : '저장 및 다음단계'}
            </b>
            <img className={styles.caretrightIcon} alt="" src="CaretRight.svg" />
          </div>
          <div className={styles.component26}>
            <div className={styles.component26Child} />
            <b className={styles.b14}>건너뛰기</b>
          </div>
        </div>
      </div>
      <img className={styles.headerIcon} alt="" src={header} />
      <div className={styles.rectangleParent4}>
        <img className={styles.rectangleParent4} alt="" src={lnb} />
      </div>
    </div>
  );
};

export default Companies;