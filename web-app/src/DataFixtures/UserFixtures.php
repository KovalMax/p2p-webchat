<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Ramsey\Uuid\Uuid;

class UserFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $user = (new User())
            ->setEmail('max@gmail.com')
            ->setPassword('$argon2id$v=19$m=65536,t=4,p=1$xMOo8oH9gw0TM65uvoLRLw$VBIUehqWXhZaMf6nlh7BhkulbG3a+TVfkOYr50p78uE');

        $manager->persist($user);
        $manager->flush();
    }
}
