function calculateAge(dateOfBirth)
{
	var today = new Date();
	var birthDate = new Date(dateOfBirth);
	var age = today.getFullYear() - birthDate.getFullYear();
	var m = today.getMonth() - birthDate.getMonth();
	if(m<0 || (m === 0 && today.getDate() < birthDate.getDate()))
	{
		age--;
	}
	return age;


}
exports.ageFilter = function (req, res, next)
{
	var age =  calculateAge(req.query.dob);
	console.log(age);
	req.age = age;
	if(age>=18)
	{
		next();
	}
	else
	{
		res.send('Age is less then 18 so you are not allowed to access the data ');
	}
};