import { useState, useRef, useCallback, useEffect } from 'react';
import Calendar from "../components/Calendar";
import PortalPopup from "../components/PortalPopup";
import styles from './Component1.module.css';
import axios from 'axios';
import smallCheck from '../asset/small_check.svg';
import R1136 from '../asset/Rectangle 1136.svg';
import close from '../asset/close.svg';

const Component1 = ({ onSave, onClose, companyId, project }) => {
  const inputContainerRef = useRef(null);
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  
  // 폼 입력을 위한 상태
  const [projectTitle, setProjectTitle] = useState("");
  const [taskName, setTaskName] = useState("");
  const [durationStart, setDurationStart] = useState("");
  const [durationEnd, setDurationEnd] = useState("");
  const [budget, setBudget] = useState("");
  const [agency, setAgency] = useState("");
  const [role, setRole] = useState("");
  const [performanceGrade, setPerformanceGrade] = useState("");
  const [performed, setPerformed] = useState("");
  const [keywords, setKeywords] = useState({
    정보통신: false,
    인공지능: false,
    빅데이터: false,
    IoT: false,
    블록체인: false,
    바이오: false,
    화학공학: false,
    기계공학: false,
    전자공학: false,
    재료공학: false,
    환경공학: false,
    에너지: false,
    의료기기: false,
    자동차: false,
    항공우주: false,
    건축: false,
    설계: false,
    마케팅: false,
    디자인: false,
    기타: false,
  });

    useEffect(() => {
    if (project) {
        setProjectTitle(project.project_title || '');
        setTaskName(project.task_name || '');
        setDurationStart(project.duration_start?.slice(0, 7) || '');
        setDurationEnd(project.duration_end?.slice(0, 7) || '');
        setBudget(project.budget || '');
        setAgency(project.agency || '');
        setRole(project.role || '');
        setPerformanceGrade(project.performance_grade || '');
        setPerformed(project.performed ? "완료" : "수행 중");

        const initKeywords = {};
        Object.keys(keywords).forEach(k => {
        initKeywords[k] = project.keywords?.split(", ").includes(k);
        });
        setKeywords(initKeywords);
    }
    }, [project]);

  useEffect(() => {
    console.log('Keywords state:', keywords); // 디버깅용 로그
  }, [keywords]);

  const openCalendar = useCallback(() => {
    console.log('openCalendar called'); // 디버깅용 로그
    setCalendarOpen(true);
  }, []);

  const closeCalendar = useCallback(() => {
    console.log('closeCalendar called'); // 디버깅용 로그
    setCalendarOpen(false);
  }, []);

  const handleKeywordChange = (keyword) => {
    console.log('Keyword clicked:', keyword); // 디버깅용 로그
    setKeywords((prev) => ({ ...prev, [keyword]: !prev[keyword] }));
  };

  const handleSave = async () => {
    console.log('handleSave called'); // 디버깅용 로그
    if (!projectTitle || !taskName) {
      alert('사업명과 과제명은 필수 입력 항목입니다.');
      return;
    }

    const selectedKeywords = Object.keys(keywords).filter((key) => keywords[key]).join(", ");
    const projectData = {
      company_id: companyId,
      project_title: projectTitle,
      task_name: taskName,
      duration_start: durationStart || null,
      duration_end: durationEnd || null,
      budget: budget || null,
      agency,
      role,
      performance_grade: performanceGrade,
      performed: performed === "완료" ? true : performed === "수행 중" ? false : null,
      keywords: selectedKeywords || null,
    };

        try {
        if (project?.id) {
            // 수정
            await axios.put(`/api/projects/${project.id}`, projectData);
        } else {
            // 신규 등록
            await axios.post('/api/projects', projectData);
        }

        if (onSave) onSave(projectData);
        if (onClose) onClose();
        } catch (error) {
        console.error('Error saving project:', error);
        alert('프로젝트 저장에 실패했습니다.');
        }};

  return (
    <>
      <div className={styles.div}>
        <div className={styles.div1}>
          <b className={styles.b}>핵심키워드</b>
          <div className={styles.rectangleParent}>
            <div className={styles.groupChild} />
            <div className={styles.groupParent}>
              {Object.keys(keywords).map((keyword) => (
                <div className={styles.rectangleGroup} key={keyword}>
                  <div className={styles.groupInner} />
                  <div className={styles.smallCheckParent}>
                    <div className={styles.smallCheck} onClick={() => handleKeywordChange(keyword)}>
                    <div className={styles.stateLayer}>
                    {!keywords[keyword] ? (
                        <div className={styles.innerContainer} />
                    ) : (
                        <img className={styles.checkSmallIcon} alt="" src={smallCheck} />
                    )}
                    </div>
                    </div>
                    <div className={styles.iot} onClick={() => handleKeywordChange(keyword)}>
                      {keyword}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.frameParent}>
            <div className={styles.groupContainer}>
              <div className={styles.groupParent1}>
                <div className={styles.parent}>
                  <div className={styles.div21}>사업명</div>
                  <div className={styles.inputBasic}>
                    <div className={styles.bg} />
                    <input
                      className={styles.div22}
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="예 : 2025 연구개발 특구 육성 지원 사업"
                    />
                  </div>
                </div>
                <div className={styles.div23}>과제명</div>
                <div className={styles.inputBasicc}>
                  <div className={styles.bg} />
                  <input
                    className={styles.div22}
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="예 : IoT 기반 스마트팜 플랫폼 개발"
                  />
                </div>
              </div>
              <div className={styles.inputBasicParent}>
                <div className={styles.div26}>발주처</div>
                <div className={styles.inputBasic3}>
                  <div className={styles.bg}>
                    <select
                      className={styles.div22}
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                 >
                    <option value="">선택</option>
                    <option value="1억원 미만">1억원 미만</option>
                    <option value="1억원 - 5억원">1억원 - 5억원</option>
                    <option value="5억원 - 10억원">5억원 - 10억원</option>
                    <option value="10억원 이상">10억원 이상</option>                    
                  </select>
                  </div>
                </div>
                <div className={styles.div27}>사업규모</div>
                <div className={styles.inputBasic}>
                  <div className={styles.bg} />
                  <select
                    className={styles.div22}
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                    >
                      <option value="">선택</option>
                        <option value="농림축산식품부">농림축산식품부</option>
                        <option value="중소벤처기업부">중소벤처기업부</option>
                        <option value="과학기술정보통신부">과학기술정보통신부</option>
                        <option value="산업통상자원부">산업통상자원부</option>
                        <option value="국토교통부">국토교통부</option>
                        <option value="보건복지부">보건복지부</option>
                        <option value="교육부">교육부</option>
                        <option value="행정안전부">행정안전부</option>
                        <option value="기타 (직접 입력)">기타 (직접 입력)</option>
                        </select>    
                </div>
              </div>
                <div className={styles.group}>
                <div className={styles.div28}>사업기간</div>
                <div className={styles.div29}>수행역할</div>
                <div className={styles.input}>
                    <div className={styles.input1}>
                    <div className={styles.baseInput}>
                        <img className={styles.calendarcheckIcon} alt="" src="CalendarCheck.svg" />
                        <input
                        className={styles.div30}
                        value={durationStart}
                        onChange={(e) => setDurationStart(e.target.value)}
                        placeholder="YYYY-MM"
                        type="month"
                        />
                    </div>
                    </div>
                    <div className={styles.inputInner}>
                    <div className={styles.frameChild} />
                    </div>
                    <div className={styles.input2}>
                    <div className={styles.baseInput1}>
                        <img className={styles.calendarcheckIcon} alt="" src="CalendarCheck.svg" />
                        <input
                        className={styles.div30}
                        value={durationEnd}
                        onChange={(e) => setDurationEnd(e.target.value)}
                        placeholder="YYYY-MM"
                        type="month"
                        />
                    </div>
                    </div>
                </div>
                <div className={styles.inputBasic9}>
                  <div className={styles.bg} />
                  <select
                    className={styles.div22}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                 >
                    <option value="">선택</option>
                    <option value="주관기관">주관기관</option>
                    <option value="참여기관">참여기관</option>
                    <option value="외주·용역">외주·용역</option>
                    <option value="협의체">협의체</option>                    
                    <option value="수행기관">수행기관</option>
                  </select>
                </div>
              </div>
              <div className={styles.inputBasicGroup}>
                <div className={styles.div33}>성과등급</div>
                <div className={styles.inputBasic4}>
                  <div className={styles.bg} />
                  <select
                    className={styles.div22}
                    value={performanceGrade}
                    onChange={(e) => setPerformanceGrade(e.target.value)}
                  >
                    <option value="">선택</option>
                    <option value="S (매우 우수)">S (매우 우수)</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                  <img className={styles.icon} alt="" src="Icon.svg" />
                </div>
                <div className={styles.div35}>수행여부</div>
                <div className={styles.inputBasic5}>
                  <div className={styles.bg} />
                  <select
                    className={styles.div22}
                    value={performed}
                    onChange={(e) => setPerformed(e.target.value)}
                  >
                    <option value="">선택</option>
                    <option value="완료">완료</option>
                    <option value="수행 중">수행 중</option>
                  </select>
                  <img className={styles.icon} alt="" src="Icon.svg" />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.vectorParent}>
            <img className={styles.frameItem} alt="" src={R1136} />
            <b className={styles.b1}>사업 정보 입력</b>
            <img
              className={styles.closeIcon}
              alt=""
              src={close}
              onClick={onClose}
            />
            <button className={styles.component13} onClick={handleSave}>
              <div className={styles.component13Child} />
              <b className={styles.b12}>저장</b>
              <img className={styles.caretrightIcon} alt="" src="CaretRight.svg" />
            </button>
          </div>
        </div>
      </div>
      {isCalendarOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Bottom left"
          bottom={-40}
          relativeLayerRef={inputContainerRef}
          onOutsideClick={closeCalendar}
        >
          <Calendar onClose={closeCalendar} />
        </PortalPopup>
      )}
    </>
  );
};

export default Component1;