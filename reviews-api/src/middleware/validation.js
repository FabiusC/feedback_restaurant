export const validateReview = (req, res, next) => {
    const { idemployee, ratespeedservice, ratesatisfactionfood, rateemployee, comment } = req.body;

    if (idemployee && (typeof idemployee !== 'number' || idemployee <= 0)) {
        return res.status(400).json({ error: 'Employee ID must be a positive number.' });
    }

    if (typeof ratespeedservice !== 'number' || ratespeedservice < 1 || ratespeedservice > 5) {
        return res.status(400).json({ error: 'Speed service rating must be a number between 1 and 5.' });
    }

    if (typeof ratesatisfactionfood !== 'number' || ratesatisfactionfood < 1 || ratesatisfactionfood > 5) {
        return res.status(400).json({ error: 'Food satisfaction rating must be a number between 1 and 5.' });
    }

    if (rateemployee !== undefined && rateemployee !== null && (typeof rateemployee !== 'number' || rateemployee < 1 || rateemployee > 5)) {
        return res.status(400).json({ error: 'Employee rating must be a number between 1 and 5.' });
    }

    if (typeof comment !== 'string' || comment.length < 10 || comment.length > 500) {
        return res.status(400).json({ error: 'Comment must be a string between 10 and 500 characters.' });
    }

    next();
};

export default validateReview;