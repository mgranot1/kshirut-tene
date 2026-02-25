import './ConcatPopover.scss';

type Position = 'top' | 'right'

interface IConcatPopoverProps {
    open: boolean,
    position: Position,
    anchorRef: React.RefObject<HTMLButtonElement>;
    children: React.ReactNode
}

const ConcatPopover = ({ open, position, anchorRef, children }: IConcatPopoverProps) => {
    if (!open || anchorRef.current) return null
    return <div className={`ConcatPopover popover-${position}`}>
        {children}
    </div>
}

export default ConcatPopover;