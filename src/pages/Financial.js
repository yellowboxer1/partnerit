import { useEffect, useState, useCallback } from 'react';
import styles from './css/Financial.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import header from '../asset/header.svg';
import widget from '../asset/widget2.svg';
import lnb from '../asset/LNB2.svg'
import icon from '../asset/icon.svg';
import upload from '../asset/upload.svg';
import Vector from '../asset/Vector.svg';


const Financial = () => {
  const { id } = useParams();
  const [financialData, setFinancialData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const onGroupContainerClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const onGroupContainerClick2 = useCallback(() => {
  if (!id) {
    alert('기업 정보를 먼저 저장해주세요.');
    return;
  }
  navigate(`/projects/${id}`);
}, [navigate, id]);

  
  // 재무 현황 데이터 상태 관리
  const [financialTable, setFinancialTable] = useState({
    매출액: { 2021: '', 2022: '', 2023: '', 2024: '', 2025: '' },
    총부채: { 2021: '', 2022: '', 2023: '', 2024: '', 2025: '' },
    총자본: { 2021: '', 2022: '', 2023: '', 2024: '', 2025: '' },
    총자산: { 2021: '', 2022: '', 2023: '', 2024: '', 2025: '' },
    자본금: { 2021: '', 2022: '', 2023: '', 2024: '', 2025: '' }
  });
  
  // 재무 건전성 분석 데이터 상태 관리
  const [analysisData, setAnalysisData] = useState({
    자본잠식률: '',
    부채비율: '',
    자본잠식상태: '해당없음'
  });

  // 사업비 수행능력 데이터 상태 관리
  const [performanceData, setPerformanceData] = useState({
    자부담가능액: '',
    신용평가등급: '선택'
  });

  const getErrorMessage = (error, response) => {
  if (!navigator.onLine) {
    return '인터넷 연결을 확인해주세요.';
  }
  
  if (response?.status === 404) {
    return '데이터를 찾을 수 없습니다. 페이지를 새로고침 후 다시 시도해주세요.';
  }
  
  if (response?.status === 500) {
    return '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }
  
  if (response?.status === 400) {
    return '입력하신 정보에 오류가 있습니다. 다시 확인해주세요.';
  }
  
  if (error.message.includes('fetch')) {
    return '서버와의 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.';
  }
  
  return '저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
};
  // 숫자를 쉼표가 포함된 형태로 표시하는 함수
  const formatNumberWithCommas = (value) => {
    if (!value) return '';
    // 숫자만 추출하여 쉼표 추가
    const numericValue = value.toString().replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return parseInt(numericValue).toLocaleString('ko-KR');
  };

  // 입력값에서 쉼표를 제거하여 순수 숫자만 반환하는 함수
  const removeCommas = (value) => {
    return value.replace(/[^0-9]/g, '');
  };

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/financials/${id}`);

        if (!response.ok) throw new Error('불러오기 실패');
        const data = await response.json();
        setFinancialData(data);
        
        // 서버에서 받은 데이터로 상태 업데이트
        if (data.financialTable) setFinancialTable(data.financialTable);
        if (data.analysisData) setAnalysisData(data.analysisData);
        if (data.performanceData) setPerformanceData(data.performanceData);
      } catch (err) {
        console.error('재무정보 불러오기 실패:', err.message);
      }
    };

    if (id) fetchFinancialData();
  }, [id]);

  useEffect(() => {
  calculateFinancialRatios();
}, [financialTable]);

  // 재무 테이블 입력 핸들러
  const handleTableInputChange = (category, year, value) => {
    // 쉼표 제거하여 숫자만 저장
    const numericValue = removeCommas(value);
    
    setFinancialTable(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [year]: numericValue
      }
    }));

    // 자동 계산 트리거
    calculateFinancialRatios(category, year, numericValue);
  };

  // 재무 비율 자동 계산
  const calculateFinancialRatios = () => {
    // 최신 데이터로 계산 (2025년 기준)
    const currentData = financialTable;
    const 총자본 = parseFloat(currentData.총자본['2025']) || 0;
    const 총부채 = parseFloat(currentData.총부채['2025']) || 0;
    const 자본금 = parseFloat(currentData.자본금['2025']) || 0;

    // 부채비율 계산: (총부채 ÷ 총자본) × 100
    let 부채비율 = 0;
    if (총자본 > 0) {
      부채비율 = ((총부채 / 총자본) * 100).toFixed(2);
    }

    // 자본잠식률 계산: (자본금 - 총자본) ÷ 자본금 × 100
    let 자본잠식률 = 0;
    let 자본잠식상태 = '해당없음';

    if (자본금 > 0) {
      자본잠식률 = (((자본금 - 총자본) / 자본금) * 100).toFixed(2);

      if (자본잠식률 < 50) {
        자본잠식상태 = '해당없음';
      } else if (자본잠식률 < 100) {
        자본잠식상태 = '부분자본잠식';
      } else {
        자본잠식상태 = '완전자본잠식';
      }
    }

    setAnalysisData(prev => ({
      ...prev,
      부채비율: 부채비율,
      자본잠식률: 자본잠식률,
      자본잠식상태: 자본잠식상태
    }));
  };

  // 분석 데이터 입력 핸들러
  const handleAnalysisInputChange = (field, value) => {
    setAnalysisData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 사업비 수행능력 입력 핸들러
  const handlePerformanceInputChange = (field, value) => {
    if (field === '자부담가능액') {
      // 쉼표 제거하여 숫자만 저장
      const numericValue = removeCommas(value);
      setPerformanceData(prev => ({
        ...prev,
        [field]: numericValue
      }));
    } else {
      setPerformanceData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // 데이터 유효성 검사 함수
  const validateFinancialData = () => {
    const errors = [];
    
    // 필수 필드 검사 (최근 2년은 필수)
    const requiredFields = ['2024', '2025'];
    const categories = ['매출액', '총자본', '총부채', '자본금'];
    
    categories.forEach(category => {
      requiredFields.forEach(year => {
        if (!financialTable[category][year] || financialTable[category][year] === '') {
          errors.push(`${category} ${year}년 데이터가 누락되었습니다.`);
        }
      });
    });
    
    // 자부담가능액 검사
    if (!performanceData.자부담가능액 || performanceData.자부담가능액 === '') {
      errors.push('자부담가능액을 입력해주세요.');
    }
    
    // 신용평가등급 검사
    if (performanceData.신용평가등급 === '선택') {
      errors.push('신용평가등급을 선택해주세요.');
    }
    
    if (errors.length > 0) {
      alert('다음 필드를 확인해주세요:\n' + errors.join('\n'));
      return false;
    }
    
    return true;
  };

  // 데이터 저장 함수 (개선된 버전)
  const saveFinancialData = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const dataToSave = {
        financialTable,
        analysisData,
        performanceData,
        updatedAt: new Date().toISOString()
      };
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/financials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });
      
      if (!response.ok) {
        const errorMessage = getErrorMessage(null, response);
        throw new Error(errorMessage);
      }
      
      alert('✅ 재무정보가 성공적으로 저장되었습니다!');
      navigate(`/projects/${id}`); // 사업정보 페이지로 이동
      
    } catch (err) {
      console.error('저장 실패:', err);
      const userFriendlyMessage = getErrorMessage(err);
      alert('❌ ' + userFriendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 유효성 검사를 포함한 저장 함수
  const saveFinancialDataWithValidation = async () => {
    // 유효성 검사 실행
    if (!validateFinancialData()) {
      return;
    }
    
    // 저장 실행
    await saveFinancialData();
  };

  // 입력 필드 스타일
  const inputStyle = {
    position: 'absolute',
    height: '39.01px',
    width: '179.01px',
    top: '0px',
    left: '0px',
    fontWeight: 400,
    color: '#1E1D2D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'var(--font-size-15)',
    fontFamily: 'Pretendard',
    border: '0.5px solid #E2E8F0', // 외곽선 컬러 추가
    textAlign: 'center',          // 글자 수평 중앙 정렬
    padding: 0 
  };

    // 입력 필드 스타일
  const inputStyle1 = {
    position: 'absolute',
    height: '39.01px',
    width: '279.01px',
    top: '0px',
    left: '0px',
    fontWeight: 400,
    color: '#1E1D2D',
    fontFamily: 'Pretendard',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'var(--font-size-15)',
    border: '0px solid #E2E8F0', // 외곽선 컬러 추가
    textAlign: 'center',          // 글자 수평 중앙 정렬
    padding: 0 
  };


  return (
    <div className={styles.ver2}>
      <div className={styles.div}>
        <div className={styles.child} />
        <img className={styles.item} alt="" src={icon} />
        <b className={styles.b}>이어봄</b>
        <img className={styles.vectorIcon} alt="" src="Vector.svg" />
        <div className={styles.parent} onClick={onGroupContainerClick}>
          <b className={styles.b1}>기업개요</b>
          <div className={styles.groupChild} />
        </div>
        <div className={styles.group}>
          <b className={styles.b1}>재무정보</b>
          <div className={styles.groupItem} />
        </div>
        <div className={styles.container} onClick={onGroupContainerClick2}>
          <b className={styles.b1}>사업정보</b>
          <div className={styles.groupChild} />
        </div>
        <div className={styles.groupDiv} onClick={onGroupContainerClick}>
          <b className={styles.b1}>가점정보</b>
          <div className={styles.groupChild} />
        </div>
        <div className={styles.div1}>관리자</div>
        <div className={styles.inputBasicWrapper}>
          <div className={styles.inputBasic}>
            <div className={styles.inputBasic1} />
          </div>
        </div>
      </div>
      <div className={styles.ver2Child} />
      <div className={styles.groupParent}>
        <div className={styles.groupContainer}>
          <div className={styles.frameParent}>
            <div className={styles.frameDiv} />

        
            
            {/* 2021년 - 매출액 행 */}
            <div className={styles.rectangleParent0}>
              <div className={styles.instanceChild} />
              <input
                type="text"
                value={formatNumberWithCommas(financialTable.매출액['2021'])}
                onChange={(e) => handleTableInputChange('매출액', '2021', e.target.value)}
                style={inputStyle}
                placeholder="-"
              />
            </div>
            {/* 2021년 - 자본금 행 */}
            <div className={styles.rectangleParent4}>
              <div className={styles.instanceChild} />
              <input
                type="text"
                value={formatNumberWithCommas(financialTable.자본금['2021'])}
                onChange={(e) => handleTableInputChange('자본금', '2021', e.target.value)}
                style={inputStyle}
                placeholder="-"
              />
            </div>
            {/* 2021년 - 총부채 행 */}
            <div className={styles.rectangleParent8}>
              <div className={styles.instanceChild} />
              <input
                type="text"
                value={formatNumberWithCommas(financialTable.총부채['2021'])}
                onChange={(e) => handleTableInputChange('총부채', '2021', e.target.value)}
                style={inputStyle}
                placeholder="-"
              />
            </div>
            {/* 2021년 - 총자본 행 */}
            <div className={styles.rectangleParent12}>
              <div className={styles.instanceChild} />
              <input
                type="text"
                value={formatNumberWithCommas(financialTable.총자본['2021'])}
                onChange={(e) => handleTableInputChange('총자본', '2021', e.target.value)}
                style={inputStyle}
                placeholder="-"
              />
            </div>
            {/* 2021년 - 총자산 행 */}
            <div className={styles.rectangleParent16}>
              <div className={styles.instanceChild15} />
              <input
                type="text"
                value={formatNumberWithCommas(financialTable.총자산['2021'])}
                onChange={(e) => handleTableInputChange('총자산', '2021', e.target.value)}
                style={inputStyle}
                placeholder="-"
              />
            </div>

            {/* 2022년 - 매출액 행 */}
            <div className={styles.rectangleGroup}>
              <div className={styles.instanceItem} />
              <input
                type="text"
                value={formatNumberWithCommas(financialTable.매출액['2022'])}
                onChange={(e) => handleTableInputChange('매출액', '2022', e.target.value)}
                style={inputStyle}
                placeholder="-"
              />
            </div>
            {/* 2022년 - 자본금 행 */}
            <div className={styles.rectangleParent5}>
              <div className={styles.instanceItem} />
              <input
                type="text"
                value={formatNumberWithCommas(financialTable.자본금['2022'])}
                onChange={(e) => handleTableInputChange('자본금', '2022', e.target.value)}
                style={inputStyle}
                placeholder="-"
              />
            </div>
            {/* 2022년 - 총부채 행 */}
            <div className={styles.rectangleParent9}>
              <div className={styles.instanceItem} />
              <input
                type="text"
                value={formatNumberWithCommas(financialTable.총부채['2022'])}
                onChange={(e) => handleTableInputChange('총부채', '2022', e.target.value)}
                style={inputStyle}
                placeholder="-"
              />
            </div>
            {/* 2022년 - 총자본 행 */}
            <div className={styles.rectangleParent13}>
              <div className={styles.instanceItem} />
              <input
                type="text"
                value={formatNumberWithCommas(financialTable.총자본['2022'])}
                onChange={(e) => handleTableInputChange('총자본', '2022', e.target.value)}
                style={inputStyle}
                placeholder="-"
              />
            </div>
            {/* 2022년 - 총자산 행 */}
            <div className={styles.rectangleParent17}>
              <div className={styles.instanceChild16} />
              <input
                type="text"
                value={formatNumberWithCommas(financialTable.총자산['2022'])}
                onChange={(e) => handleTableInputChange('총자산', '2022', e.target.value)}
                style={inputStyle}
                placeholder="-"
              />
            </div>

            {/* 2023년 - 매출액 행 */}
            <div className={styles.rectangleContainer}>
              <div className={styles.instanceItem} />
              <input
                type="text"
                value={formatNumberWithCommas(financialTable.매출액['2023'])}
                onChange={(e) => handleTableInputChange('매출액', '2023', e.target.value)}
                style={inputStyle}
                placeholder="-"
              />
            </div>
            {/* 2023년 - 자본금 행 */}
            <div className={styles.rectangleParent6}>
              <div className={styles.instanceItem} />
              <input
                type="text"
                value={formatNumberWithCommas(financialTable.자본금['2023'])}
                onChange={(e) => handleTableInputChange('자본금', '2023', e.target.value)}
                style={inputStyle}
                placeholder="-"
              />
            </div>
            {/* 2023년 - 총부채 행 */}
            <div className={styles.rectangleParent10}>
              <div className={styles.instanceItem} />
              <input
                type="text"
                value={formatNumberWithCommas(financialTable.총부채['2023'])}
                onChange={(e) => handleTableInputChange('총부채', '2023', e.target.value)}
                style={inputStyle}
                placeholder="-"
              />
            </div>
            {/* 2023년 - 총자본 행 */}
            <div className={styles.rectangleParent14}>
              <div className={styles.instanceItem} />
              <input
                type="text"
                value={formatNumberWithCommas(financialTable.총자본['2023'])}
                onChange={(e) => handleTableInputChange('총자본', '2023', e.target.value)}
                style={inputStyle}
                placeholder="-"
              />
            </div>
            {/* 2023년 - 총자산 행 */}
            <div className={styles.rectangleParent18}>
              <div className={styles.instanceChild16} />
              <input
                type="text"
                value={formatNumberWithCommas(financialTable.총자산['2023'])}
                onChange={(e) => handleTableInputChange('총자산', '2023', e.target.value)}
                style={inputStyle}
                placeholder="-"
              />
            </div>

            {/* 2024년 - 매출액 행 */}
            <div className={styles.rectangleParent1}>
              <div className={styles.instanceChild1} />
              <input
                type="text"
                value={formatNumberWithCommas(financialTable.매출액['2024'])}
                onChange={(e) => handleTableInputChange('매출액', '2024', e.target.value)}
                style={inputStyle}
                placeholder="-"
              />
            </div>
            {/* 2024년 - 자본금 행 */}
            <div className={styles.rectangleParent7}>
              <div className={styles.instanceChild1} />
              <input
                type="text"
                value={formatNumberWithCommas(financialTable.자본금['2024'])}
                onChange={(e) => handleTableInputChange('자본금', '2024', e.target.value)}
                style={inputStyle}
                placeholder="-"
              />
            </div>
            {/* 2024년 - 총부채 행 */}
            <div className={styles.rectangleParent11}>
              <div className={styles.instanceChild1} />
              <input
                type="text"
                value={formatNumberWithCommas(financialTable.총부채['2024'])}
                onChange={(e) => handleTableInputChange('총부채', '2024', e.target.value)}
                style={inputStyle}
                placeholder="-"
              />
            </div>            
            {/* 2024년 - 총자본 행 */}
            <div className={styles.rectangleParent15}>
              <div className={styles.instanceChild1} />
              <input
                type="text"
                value={formatNumberWithCommas(financialTable.총자본['2024'])}
                onChange={(e) => handleTableInputChange('총자본', '2024', e.target.value)}
                style={inputStyle}
                placeholder="-"
              />
            </div>            
            {/* 2024년 - 총자산 행 */}
            <div className={styles.rectangleParent19}>
              <div className={styles.instanceChild18} />
              <input
                type="text"
                value={formatNumberWithCommas(financialTable.총자산['2024'])}
                onChange={(e) => handleTableInputChange('총자산', '2024', e.target.value)}
                style={inputStyle}
                placeholder="-"
              />
            </div>              

            {/* 2025년 - 매출액 행 */}
            <div className={styles.rectangleParent2}>
              <div className={styles.instanceChild1} />
              <input
                type="text"
                value={formatNumberWithCommas(financialTable.매출액['2025'])}
                onChange={(e) => handleTableInputChange('매출액', '2025', e.target.value)}
                style={inputStyle}
                placeholder="-"
              />
            </div>            
            {/* 2025년 - 자본금 행 */}
            <div className={styles.rectangleParent20}>
              <div className={styles.instanceChild1} />
              <input
                type="text"
                value={formatNumberWithCommas(financialTable.자본금['2025'])}
                onChange={(e) => handleTableInputChange('자본금', '2025', e.target.value)}
                style={inputStyle}
                placeholder="-"
              />
            </div>
            {/* 2025년 - 총부채 행 */}
            <div className={styles.rectangleParent21}>
              <div className={styles.instanceChild1} />
              <input
                type="text"
                value={formatNumberWithCommas(financialTable.총부채['2025'])}
                onChange={(e) => handleTableInputChange('총부채', '2025', e.target.value)}
                style={inputStyle}
                placeholder="-"
              />
            </div>
            {/* 2025년 - 총자본 행 */}
            <div className={styles.rectangleParent22}>
              <div className={styles.instanceChild1} />
              <input
                type="text"
                value={formatNumberWithCommas(financialTable.총자본['2025'])}
                onChange={(e) => handleTableInputChange('총자본', '2025', e.target.value)}
                style={inputStyle}
                placeholder="-"
              />
            </div>
            {/* 2025년 - 총자산 행 */}
            <div className={styles.rectangleParent23}>
              <div className={styles.instanceChild18} />
              <input
                type="text"
                value={formatNumberWithCommas(financialTable.총자산['2025'])}
                onChange={(e) => handleTableInputChange('총자산', '2025', e.target.value)}
                style={inputStyle}
                placeholder="-"
              />
            </div>

            {/* 년도 헤더들 */}
            <div className={styles.wrapper}>
              <div className={styles.div29}>2020</div>
            </div>
            <div className={styles.frame}>
              <div className={styles.div29}>2021</div>
            </div>
            <div className={styles.wrapper1}>
              <div className={styles.div29}>2022</div>
            </div>
            <div className={styles.wrapper2}>
              <div className={styles.div29}>2023</div>
            </div>
            <div className={styles.wrapper3}>
              <div className={styles.div33}>2024</div>
            </div>
            <div className={styles.div34}>최근 5년간 기업현황 (단위 : 천 원)</div>
            
            {/* 행 라벨들 */}
            <div className={styles.rectangleParent3}>
              <div className={styles.groupChild1} />
              <div className={styles.div7}>매출액</div>
            </div>
            <div className={styles.rectangleParent24}>
              <div className={styles.groupChild1} />
              <div className={styles.div7}>자본금</div>
            </div>            
            <div className={styles.rectangleParent25}>
              <div className={styles.groupChild1} />
              <div className={styles.div35}>총부채</div>
            </div>
            <div className={styles.rectangleParent26}>
              <div className={styles.groupChild1} />
              <div className={styles.div35}>총자본</div>
            </div>
            <div className={styles.rectangleParent27}>
              <div className={styles.groupChild1} />
              <div className={styles.div35}>총자산</div>
            </div>
            
            <div className={styles.groupChild6} />
            <div className={styles.div38}>구분</div>
          </div>
          <div className={styles.vectorParent}>
            <img className={styles.vectorIcon1} alt="" src={Vector} />
            <div className={styles.div39}>
              <p className={styles.p}>※ 최근 5년간 재무 현황을 자세히 입력해주세요. 재무제표를 업로드 하거나, 재무 현황을 입력하면 자동으로 부채비율 및 자본잠식률이 계상됩니다.</p>
              <p className={styles.p}>※ 신용평가등급은 입찰 등록 마감일 이전에 평가한 것을 기준으로 유효기간 내에 있는 가장 최근의 회사채 기준입니다.</p>
            </div>
          </div>
          <div className={styles.groupParent1}>
            <div className={styles.rectangleParent28}>
              <div className={styles.groupChild7} />
              <div className={styles.uploadParent}>
                <img className={styles.uploadIcon} alt="" src={upload} />
                <div className={styles.excel}>EXCEL 업로드</div>
              </div>
            </div>
            <b className={styles.b5}>재무 현황</b>
            <img className={styles.icon} alt="" src="Icon.svg" />
          </div>
        </div>
        <div className={styles.parent1}>
          <b className={styles.b6}>재무건전성 분석</b>
          <div className={styles.frameGroup}>
            <div className={styles.rectangleParent29}>
              <div className={styles.instanceChild} />
              <div className={styles.div40}>자본잠식률에 따른 자동 분류</div>
            </div>
            <div className={styles.rectangleParent30}>
              <div className={styles.frameItem} />
            <div className={styles.none}>
              <div
                className={`${styles.noneChild} ${
                  analysisData.자본잠식상태 === '완전자본잠식'
                    ? styles.noneChild2
                    : analysisData.자본잠식상태 === '부분자본잠식'
                    ? styles.noneChild1
                    : styles.noneChild
                }`}
              />
              <b
                className={`${styles.b7} ${
                  analysisData.자본잠식상태 === '완전자본잠식'
                    ? styles.b72
                    : analysisData.자본잠식상태 === '부분자본잠식'
                    ? styles.b71
                    : styles.b7
                }`}
              >
                {analysisData.자본잠식상태}
              </b>
            </div>
            </div>
            <div className={styles.rectangleParent31}>
              <div className={styles.instanceChild23} />
              <div className={styles.div41}>자본잠식상태</div>
            </div>
            <div className={styles.rectangleParent32}>
              <div className={styles.instanceChild} />
              <div className={styles.div42}>{`(자본금 - 총자본) ÷  자본금 × 100 `}</div>
            </div>
            <div className={styles.rectangleParent33}>
              <div className={styles.frameItem} />
              <input
                type="text"
                value={analysisData.자본잠식률}
                readOnly // 자동 계산되므로 읽기 전용
                style={{...inputStyle1, width: '100%'}}
              />
              <span className={styles.div43}>%</span>
            </div>
            <div className={styles.rectangleParent34}>
              <div className={styles.instanceChild15} />
              <div className={styles.div40}>{`총부채 ÷ 총자본 × 100 `}</div>
            </div>
            <div className={styles.rectangleParent35}>
              <div className={styles.frameChild3} />
              <input
                type="text"
                value={analysisData.부채비율}
                readOnly // 자동 계산되므로 읽기 전용
                style={{...inputStyle1, width: '100%'}}
              />
              <span className={styles.div43}>%</span>
            </div>
            <div className={styles.rectangleParent36}>
              <div className={styles.instanceChild23} />
              <div className={styles.div41}>자본잠식률</div>
            </div>
            <div className={styles.rectangleParent37}>
              <div className={styles.instanceChild25} />
              <div className={styles.div41}>부채비율</div>
            </div>
            <div className={styles.wrapper4}>
              <div className={styles.div48}>계산식</div>
            </div>
            <div className={styles.wrapper5}>
              <div className={styles.div29}>비율/상태</div>
            </div>
            <div className={styles.wrapper6}>
              <div className={styles.div50}>구분</div>
            </div>
          </div>
        </div>
        <div className={styles.parent2}>
          <b className={styles.b6}>사업비 수행능력</b>
          <div className={styles.parent3}>
            <div className={styles.div51}>자부담 가능액</div>
            <div className={styles.div52}>신용평가등급</div>
            <div className={styles.inputBasic2}>
              <div className={styles.bg} />
              <input
                type="text"
                value={formatNumberWithCommas(performanceData.자부담가능액)}
                onChange={(e) => handlePerformanceInputChange('자부담가능액', e.target.value)}
                placeholder="-"
                style={{
                  position: 'relative', // zIndex 작동을 위해 필수
                  zIndex: 1,             // 최상단으로 보이도록
                  border: 'none',
                  background: 'transparent',
                  fontFamily: 'Pretendard',  
                  fontWeight: 400, 
                  lineHeight: '90%',  
                  color: '#1e1d2d', 
                  textAlign: 'center',
                  width: '100%',
                  height: '98%',
                  fontSize: '14px',
                }}
              />
              <div className={styles.div54}>천 원</div>
            </div>
            <div className={styles.inputBasic3}>
              <div className={styles.bg} />
              <select
                value={performanceData.신용평가등급}
                onChange={(e) => handlePerformanceInputChange('신용평가등급', e.target.value)}
                style={{
                  position: 'relative',   // z-index 적용을 위해 필요
                  zIndex: 1,              // select가 위에 보이도록
                  border: 'none',
                  background: 'transparent',
                  fontFamily: 'Pretendard',   
                  fontWeight: 400,
                  color: '#1e1d2d',              
                  textAlign: 'left',
                  width: '100%',
                  height: '100%',
                  fontSize: '14px',
                }}
              >
                <option value="선택">선택</option>
                <option value="AAA">AAA</option>
                <option value="AA+">AA+</option>
                <option value="AA">AA</option>
                <option value="AA-">AA-</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="A-">A-</option>
                <option value="BBB+">BBB+</option>
                <option value="BBB">BBB</option>
                <option value="BBB-">BBB-</option>
                <option value="BB+">BB+</option>
                <option value="BB">BB</option>
                <option value="BB-">BB-</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="B-">B-</option>
                <option value="CCC+">CCC+</option>
                <option value="CCC">CCC</option>
                <option value="CCC-">CCC-</option>
                <option value="CC">CC</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
              <img className={styles.icon1} alt="" src="Icon.svg" />
            </div>
          </div>
        </div>
      </div>
      <img className={styles.widgetIcon} alt="" src={widget} />
      <div className={styles.footer}>
        <div className={styles.component13Parent}>
          <div className={styles.component13} onClick={saveFinancialData}>
            <div className={styles.component13Child} />
            <b className={styles.b9}>저장 및 다음단계</b>
            <img className={styles.caretrightIcon} alt="" src="CaretRight.svg" />
          </div>
          <div className={styles.component26}>
            <div className={styles.component26Child} />
            <b className={styles.b10}>건너뛰기</b>
          </div>
        </div>
      </div>
      <img className={styles.headerIcon} alt="" src={header} />
      <img className={styles.ver2Item} alt="" src={lnb} />
    </div>
  );
};

export default Financial;