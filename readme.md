# RDS-DNS
This is a Node based application that finds all of your RDS instances in the
specified region and then gets there IP address and updates the specified route53
zone with that address.

I created this specifically to solve a problem that I was having, which was I had
peered VPCs and I needed to be able to resolve the internal address of some RDS
instances that had both internal and external IP addresses. The internal address
can only be resolved within the VPC. So I created an internal zone in route53 and then
have this script run as a cron job to keep that zone up to date.

It may or may not be useful to others, but you are welcome to give it a shot. There are
some values that will need to changed such as region and your private zone file.
As I have free time, I may make those environment variables or something else more
flexible. I may also make it a Node module down the road, but right now, I don't really
have the time for that.

#### Created by Brad Adair. brad@adair.tech
