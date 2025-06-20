import { useState, useEffect, useCallback } from 'react';
import Component1 from "../components/Component1";
import PortalPopup from "../components/PortalPopup";
import styles from './css/Projects.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import header from '../asset/header.svg';
import widget from '../asset/widget3.svg';
import lnb from '../asset/LNB3.svg';
import icon from '../asset/icon.svg';
import upload from '../asset/Vector 2904.svg';

const Projects = () => {
  const navigate = useNavigate();
  const [isFrameOpen, setFrameOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const { companyId } = useParams();

  const fetchProjects = useCallback(async () => {
    try {
      const response = await axios.get(`/api/projects/${companyId}`);
      console.log('Fetched projects:', response.data); // 디버깅용 로그
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, [companyId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const openFrame = useCallback(() => {
    console.log('openFrame called');
    setFrameOpen(true);
  }, []);

  const closeFrame = useCallback(() => {
    console.log('closeFrame called');
    setFrameOpen(false);
  }, []);

  const handleSaveProject = useCallback((projectData) => {
    console.log('Project saved:', projectData);
    fetchProjects(); // 저장 후 서버에서 최신 데이터 다시 불러옴
    closeFrame();
  }, [fetchProjects, closeFrame]);

  const [editProject, setEditProject] = useState(null);

  const handleEdit = useCallback((project) => {
    console.log('Editing project:', project);
    setEditProject(project);
    setFrameOpen(true);
  }, []);

  const onGroupContainerClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

    const onGroupContainerClick1 = useCallback(() => {
    if (!companyId) {
        alert('기업 정보를 먼저 저장해주세요.');
        return;
    }
    navigate(`/financial/${companyId}`);
    }, [navigate, companyId]);


  // YYYY-MM-DD를 YYYY-MM으로 변환
  const formatMonth = (date) => (date ? date.slice(0, 7) : '-');

  return (
    <>
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
          <div className={styles.group} onClick={onGroupContainerClick1}>
            <b className={styles.b1}>재무정보</b>
            <div className={styles.groupChild} />
          </div>
          <div className={styles.container}>
            <b className={styles.b1}>사업정보</b>
            <div className={styles.groupInner} />
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
          <div className={styles.inner}>
            <div className={styles.groupParent}>
              <div className={styles.groupWrapper}>
                <div className={styles.rectangleParent} onClick={openFrame}>
                  <div className={styles.groupChild1} />
                  <div className={styles.div2}>사업 추가</div>
                  <img className={styles.groupChild2} alt="" src={upload} />
                </div>
              </div>
              <b className={styles.b5}>주요 사업 수행 이력</b>
            </div>
          </div>
          <div className={styles.groupContainer}>
            <table className={styles.projectTable}>
              <thead>
                <tr>
                  <th className={styles.projectName}>사업명</th>
                  <th className={styles.taskName}>과제명</th>
                  <th className={styles.agency}>발주처</th>
                  <th className={styles.budget}>사업규모</th>
                  <th className={styles.projectPeriod}>사업기간</th>
                  <th className={styles.role}>수행역할</th>
                  <th className={styles.performanceGrade}>성과등급</th>
                  <th className={styles.performed}>비고</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={styles.noData}>
                      데이터가 없음
                    </td>
                  </tr>
                ) : (
                  projects.map((project, index) => (
                    <tr key={project.id || index} onClick={() => handleEdit(project)}>
                    <td className={styles.projectName}>
                      <div className={styles.projectNameWithBadges}>
                        <div className={styles.projectTitle}>{project.project_title}</div>
                        <div className={styles.badgeWrapper}>
                          {project.keywords && project.keywords.split(", ").map((keyword, idx) => (
                            keyword && (
                              <div className={styles.rectangleContainer} key={idx}>
                                <b className={`${styles.b6} ${keyword.length > 5 ? styles.longKeyword : ''}`}>
                                  {keyword}
                                </b>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    </td>
                      <td className={styles.taskName}>{project.task_name}</td>
                      <td className={styles.agency}>{project.agency || '-'}</td>
                      <td className={styles.budget}>{project.budget || '-'}</td>
                      <td className={styles.projectPeriod}>
                        {project.duration_start && project.duration_end
                          ? `${formatMonth(project.duration_start)} - ${formatMonth(project.duration_end)}`
                          : '-'}
                      </td>
                      <td className={styles.role}>{project.role || '-'}</td>
                      <td className={styles.performanceGrade}>{project.performance_grade || '-'}</td>
                      <td className={styles.performed}>{project.performed ? '완료' : project.performed === false ? '수행 중' : '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <img className={styles.widgetIcon} alt="" src={widget} />
        <div className={styles.footer}>
          <div className={styles.component13Parent}>
            <div className={styles.component13} onClick={onGroupContainerClick}>
              <div className={styles.component13Child} />
              <b className={styles.b12}>저장 및 다음단계</b>
              <img className={styles.caretrightIcon} alt="" src="CaretRight.svg" />
            </div>
            <div className={styles.component26}>
              <div className={styles.component26Child} />
              <b className={styles.b13}>건너뛰기</b>
            </div>
          </div>
        </div>
        <img className={styles.header} alt="" src={header} />
        <img className={styles.ver2Child} alt="" src={lnb} />
      </div>
      {isFrameOpen && (
        <>
          {console.log('Rendering PortalPopup with Component1')}
          <PortalPopup
            overlayColor="rgba(0, 0, 0, 0.25)"
            placement="Centered"
            onOutsideClick={closeFrame}
          >
            <Component1
              onClose={() => {
                setFrameOpen(false);
                setEditProject(null);
              }}
              onSave={handleSaveProject}
              companyId={companyId}
              project={editProject}
            />
          </PortalPopup>
        </>
      )}
    </>
  );
};

export default Projects;