const ReviewForm = ({handleSubmit,revText,labelText,defaultValue}) => {
  return (
    <form className="review-form" onSubmit={handleSubmit}>
        <div className="form-group">
            <label className="form-label">{labelText}</label>
            <textarea className="form-control" ref={revText} rows={3} defaultValue={defaultValue}></textarea>
        </div>
        <button className="submit-btn" type="button" onClick={handleSubmit}>Submit</button>
    </form>   
  )
}

export default ReviewForm;