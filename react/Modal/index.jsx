import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from './styles.styl'

const ModalContent = ({children, className}) =>
  (<div className={classNames(styles['coz-modal-content'], className)}>
    {children}
  </div>)

const ModalSection = ({children, className}) =>
  (<div className={classNames(styles['coz-modal-content'], styles['coz-modal-section'], className)}>
    {children}
  </div>)

const ModalTitle = ({ title }) =>
  (
    <h2 className={classNames(styles['coz-modal-content'], styles['coz-modal-title'])}>{title}</h2>
  )

const ModalCross = ({ withCross, secondaryAction, secondaryText }) =>
  withCross &&
  (
    <button
      className={classNames(styles['coz-btn'], styles['coz-btn--close'], styles['coz-btn-modal-close'])}
      onClick={secondaryAction}
      >
      <span className={styles['coz-hidden']}>{secondaryText}</span>
    </button>
)

const ModalDescription = ({ description }) =>
  description &&
  (
    <div className={classNames(styles['coz-modal-content'], styles['coz-description'])}>
      {description}
    </div>
  )

const ModalButtons = ({ secondaryText, secondaryAction, secondaryType, primaryText, primaryAction, primaryType }) => {
  const displayPrimary = primaryText && primaryAction
  const displaySecondary = secondaryText && secondaryAction
  return (displaySecondary || displayPrimary) &&
    (
      <div className={classNames(styles['coz-modal-content'], styles['coz-modal-buttons'])}>
        { displaySecondary &&
          <button className={classNames(styles['coz-btn'], styles['coz-btn--' + secondaryType])} onClick={secondaryAction}>
            {secondaryText}
          </button>
        }
        { displayPrimary &&
          <button className={classNames(styles['coz-btn'], styles['coz-btn--' + primaryType])} onClick={primaryAction}>
            {primaryText}
          </button>
        }
      </div>
    )
}

const ESC_KEYCODE = 27

class Modal extends Component {
  constructor (props) {
    super(props)
    this.handleKeydown = this.handleKeydown.bind(this)
    this.handleOutsideClick = this.handleOutsideClick.bind(this)
  }

  componentDidMount () {
    if (this.props.withCross) {
      document.addEventListener('keydown', this.handleKeydown)
    }
  }

  componentWillUnmount () {
    if (this.props.withCross) {
      document.removeEventListener('keydown', this.handleKeydown)
    }
  }

  handleKeydown (e) {
    if (e.keyCode === ESC_KEYCODE) {
      this.props.secondaryAction()
    }
  }

  handleOutsideClick (e) {
    if (e.target === e.currentTarget) this.props.secondaryAction()
  }

  render () {
    const { children, title, withCross, overflowHidden } = this.props
    return (
      <div className={styles['coz-modal-container']}>
        <div className={styles['coz-overlay']}>
          <div
            className={styles['coz-modal-wrapper']}
            onClick={withCross && this.handleOutsideClick}>
            <div className={classNames(styles['coz-modal'], { [styles['coz-modal--fullbleed']]: overflowHidden })}>
              <ModalCross {...this.props} />
              {title && <ModalTitle {...this.props} />}
              <ModalDescription {...this.props} />
              { children }
              <ModalButtons {...this.props} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Modal.propTypes = {
  title: PropTypes.string,
  description: PropTypes.node,
  secondaryType: PropTypes.string,
  secondaryText: PropTypes.string,
  secondaryAction: PropTypes.func,
  primaryType: PropTypes.string,
  primaryText: PropTypes.string,
  primaryAction: PropTypes.func,
  withCross: PropTypes.bool,
  overflowHidden: PropTypes.bool
}

Modal.defaultProps = {
  primaryType: 'secondary',
  secondaryType: 'regular',
  withCross: true,
  overflowHidden: false
}

export {
  ModalContent,
  ModalSection,
  ModalButtons
}
export default Modal
