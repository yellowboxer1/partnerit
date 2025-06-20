import PropTypes from "prop-types";
import styles from './Calendar.module.css';


const Calendar = ({ className="" }) => {
  	return (
    		<div className={[styles.calendar, className].join(' ')}>
      			<div className={styles.input}>
        				<div className={styles.hint}>
          					<div className={styles.icon20}>
            						<div className={styles.div} />
            						<div className={styles.liveArea} />
          					</div>
          					<div className={styles.text}>힌트 메시지</div>
        				</div>
        				<div className={styles.baseInput}>
          					<img className={styles.calendarcheckIcon} alt="" src="CalendarCheck.svg" />
          					<div className={styles.div2}>2024.03</div>
          					<div className={styles.baseInputChild} />
          					<div className={styles.div3}>2024.12</div>
        				</div>
      			</div>
      			<div className={styles.calendar1}>
        				<div className={styles.baseCalendarHeader}>
          					<div className={styles.icon}>
            						<div className={styles.icon1}>
              							<div className={styles.iconChild} />
              							<img className={styles.dropdownArrowIcon} alt="" src="dropdown_arrow.svg" />
            						</div>
          					</div>
          					<div className={styles.year}>
            						<div className={styles.text}>2024년</div>
            						<div className={styles.icon1}>
              							<div className={styles.div4} />
              							<div className={styles.liveArea1}>
                								<div className={styles.liveAreaChild} />
                								<img className={styles.liveAreaItem} alt="" src="Vector 1.svg" />
              							</div>
            						</div>
          					</div>
          					<div className={styles.icon2}>
            						<div className={styles.icon1}>
              							<div className={styles.iconChild} />
              							<img className={styles.dropdownArrowIcon1} alt="" src="dropdown_arrow.svg" />
            						</div>
          					</div>
        				</div>
        				<div className={styles.day}>
          					<div className={styles.rectangleParent}>
            						<div className={styles.frameChild} />
            						<div className={styles.baseCalendarNumberParent}>
              							<div className={styles.baseCalendarNumber}>
                								<div className={styles.text1}>01월</div>
              							</div>
              							<div className={styles.baseCalendarNumber}>
                								<div className={styles.text1}>02월</div>
              							</div>
              							<div className={styles.baseCalendarNumber2}>
                								<div className={styles.text}>03월</div>
              							</div>
              							<div className={styles.baseCalendarNumber3}>
                								<div className={styles.text}>04월</div>
              							</div>
            						</div>
          					</div>
          					<div className={styles.dayInner}>
            						<div className={styles.rectangleGroup}>
              							<div className={styles.groupChild} />
              							<div className={styles.baseCalendarNumber4}>
                								<div className={styles.text}>05월</div>
              							</div>
              							<div className={styles.baseCalendarNumber5}>
                								<div className={styles.text}>06월</div>
              							</div>
              							<div className={styles.baseCalendarNumber6}>
                								<div className={styles.text}>07월</div>
              							</div>
              							<div className={styles.baseCalendarNumber7}>
                								<div className={styles.text}>08월</div>
              							</div>
            						</div>
          					</div>
          					<div className={styles.dayInner}>
            						<div className={styles.frameItem} />
            						<div className={styles.rectangleGroup}>
              							<div className={styles.baseCalendarNumber4}>
                								<div className={styles.text}>09월</div>
              							</div>
              							<div className={styles.baseCalendarNumber5}>
                								<div className={styles.text}>10월</div>
              							</div>
              							<div className={styles.baseCalendarNumber6}>
                								<div className={styles.text}>11월</div>
              							</div>
              							<div className={styles.baseCalendarNumber11}>
                								<div className={styles.text}>12월</div>
              							</div>
            						</div>
          					</div>
        				</div>
        				<div className={styles.btn}>
          					<div className={styles.button}>
            						<div className={styles.text}>초기화</div>
          					</div>
          					<div className={styles.button1}>
            						<div className={styles.text}>적용</div>
          					</div>
        				</div>
      			</div>
    		</div>);
};

Calendar.propTypes = {
  	className: PropTypes.string
};

export default Calendar;
