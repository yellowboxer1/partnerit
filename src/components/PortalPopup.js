import ReactDOM from "react-dom";
import styles from "./PortalPopup.module.css";

const PortalPopup = ({
  children,
  overlayColor = "rgba(0, 0, 0, 0.4)",
  placement = "Centered",
  relativeLayerRef = null,
  bottom = 0,
  right = 0,
  onOutsideClick
}) => {
  const getPopupStyle = () => {
    console.log('getPopupStyle called, placement:', placement, 'relativeLayerRef:', relativeLayerRef); // 디버깅 로그
    if (placement === "Centered") {
      return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 999
      };
    } else if (placement === "Bottom left" && relativeLayerRef?.current) {
      const rect = relativeLayerRef.current.getBoundingClientRect();
      return {
        position: "absolute",
        top: rect.bottom + window.scrollY + bottom,
        left: rect.left + window.scrollX + right,
        zIndex: 999
      };
    }
    return {
      position: "absolute",
      zIndex: 999
    };
  };

  return ReactDOM.createPortal(
    <div className={styles.popupOverlay} style={{ backgroundColor: overlayColor }} onClick={onOutsideClick}>
      <div className={styles.popupContainer} style={getPopupStyle()} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default PortalPopup;