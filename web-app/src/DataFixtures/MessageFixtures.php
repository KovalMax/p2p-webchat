<?php

namespace App\DataFixtures;

use App\Entity\Message;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;

class MessageFixtures extends Fixture implements DependentFixtureInterface
{
    /**
     * @inheritDoc
     * @throws \Exception
     */
    public function load(ObjectManager $manager): void
    {
        for ($i = 0; $i < 10; $i++) {
            /** @var User $user */
            $user = $this->getReference(constant(sprintf('%s::USER_%d', UserFixtures::class, mt_rand(1, 3))));
            $user->getMessageSettings();
            $m = new Message();
            $m->setMessage(substr(str_shuffle(MD5(microtime())), 0, 10));
            $m->setUser($user);
            $m->setCreatedAt(new \DateTimeImmutable(sprintf('-%d hour', mt_rand(1, 36))));

            $manager->persist($m);
        }

        $manager->flush();
    }

    /**
     * @inheritDoc
     */
    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
        ];
    }
}