[*] - error responses are always blank
[*] - validation not running on queries?
[*] - where is snake case applied?
[*] - usage of version string?
[*] - DELETE post instead of url
[ ] - Is it ok to have serial tests (tests cant be run separately)?
[ ] - plurals for table names?

PUT

The HTTP PUT method is the one you use when you want to update a resource. Before accessing this endpoint, the client will need to retrieve the employees, so it is able to know the id of the employee it wants to update.

An endpoint with a PUT request is accessed by sending HTTP PUT to /employees/:id, being :id the id of the chosen employee. In the body of the request must be the object that represents the employee, with the changes the client needs to make.

Ps: I’ve seen some (very few) APIs implementing the HTTP PATCH method to allow the partial update of a resource, so from experience, that’s not much used. If you need to update your resource only partially, though, then use PATCH instead.



