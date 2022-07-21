<?php

namespace App\Repository;

use App\Entity\Message;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Collections\Criteria;
use Doctrine\Persistence\ManagerRegistry;
use Exception;

/**
 * @method Message|null find($id, $lockMode = null, $lockVersion = null)
 * @method Message|null findOneBy(array $criteria, array $orderBy = null)
 * @method Message[]    findAll()
 * @method Message[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
final class MessageRepository extends ServiceEntityRepository
{
    protected const DEFAULT_ORDER = ['createdAt' => Criteria::DESC];
    protected const DEFAULT_LIMIT = 25;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Message::class);
    }

    /**
     * @return Message[]
     */
    public function getLastMessages(?int $limit = null, ?array $orderBy = null): iterable
    {
        if (null === $limit) {
            $limit = self::DEFAULT_LIMIT;
        }
        if (null === $orderBy) {
            $orderBy = self::DEFAULT_ORDER;
        }

        return $this->findBy([], $orderBy, $limit);
    }

    /**
     * @throws Exception
     */
    public function saveMessage(Message $message): void
    {
        $em = $this->getEntityManager();
        $em->persist($message);
        $em->flush($message);
    }
}
